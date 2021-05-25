import { createContext, useContext, useEffect, useState } from "react";
import useMediaStream, { useMediaStreamState } from "../stores/call/useMediaStream";
import { IUser } from "../stores/useProfile";
import Peer from "simple-peer";
import { WebSocketContext } from "./WebSocketProvider";
import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IChatListItem } from "../modules/ChatList/ChatListItem";
import useChatList from "../stores/useChatList";
import { Socket } from "socket.io-client";
import useChat from "../stores/useChat";
import { toast } from "react-toastify";
import useMediaConfigurations from "../stores/call/useMediaConfiguration";

export type CallStatus = "idle" | "rtc_connecting" | "call" | "call_outgoing" | "call_incoming";
export type RejectReason = "BUSY" | "REJECT";

interface UserCallOptions {
  muted: boolean;
  video: boolean;
  deafened: boolean;
  sharingScreen: boolean;
}

interface IPeerCallState extends State {
  userState: UserCallOptions;
  callStatus: CallStatus;
  receiverId: string;
  receiverProfile: IUser;
  receiverStream: MediaStream[];
  receiverState: UserCallOptions;
  peer: Peer.Instance;
}

const initialCallOptions: UserCallOptions = {
  muted: true,
  video: false,
  deafened: false,
  sharingScreen: false,
};

const initialPeerCallState: IPeerCallState = {
  userState: initialCallOptions,
  callStatus: "idle",
  receiverId: null,
  receiverProfile: null,
  receiverStream: [],
  peer: null,
  receiverState: initialCallOptions,
};

interface IPeerCallStateSetters extends IPeerCallState {
  setReceiverId: (receiverId: string) => void;
  setReceiverProfile: (receiverProfile: IUser) => void;
  setStatus: (status: CallStatus) => void;
  setRejectReason: (rejectReason: RejectReason) => void;
  setReceiverStream: (receiverStream: MediaStream[]) => void;
  setPeer: (peer: Peer.Instance) => void;
  setReceiverState: (receiverState: UserCallOptions) => void;
  setUserState: (userState: UserCallOptions) => void;
  resetCallState: () => void;
}

export const usePeerCallState = create<IPeerCallStateSetters>(
  combine(initialPeerCallState, (set) => ({
    setReceiverId: (receiverId: string) => set({ receiverId }),
    setStatus: (status: CallStatus) => set({ callStatus: status }),
    setRejectReason: (rejectReason: RejectReason) => set({ rejectReason }),
    setReceiverProfile: (receiverProfile: IUser) => set({ receiverProfile }),
    setReceiverStream: (receiverStream: MediaStream[]) => set({ receiverStream }),
    setPeer: (peer: Peer.Instance) => set({ peer }),
    setReceiverState: (receiverState: UserCallOptions) => set({ receiverState }),
    setUserState: (userState: UserCallOptions) => set({ userState }),
    resetCallState: () =>
      set({
        receiverState: initialCallOptions,
        userState: initialCallOptions,
        receiverStream: [],
      }),
  }))
);

interface IPeerCallContext {
  makeCall: (receiverId: string, video: boolean) => Promise<void>;
  acceptCall: (video: boolean) => Promise<void>;
  endCall: () => void;
}

export const PeerCallContext = createContext<IPeerCallContext>(null);

export const findUserFromChat = (chats: IChatListItem[], userId: string) => {
  if (!chats) return null;
  const chat = chats.find((chat) => {
    return chat.chat.participants[0].user.oauthId === userId && chat.chat.type === "personal";
  });
  if (chat) return chat.chat.participants[0].user;
  else return null;
};

const PeerCallWrapper: React.FC = ({ children }) => {
  const peerCallState = usePeerCallState();
  const {
    mediaStream,
    displayMediaStream,
    waitForDisplayMediaStream,
    asyncEndDisplayMediaStream,
    waitForMediaStream,
    checkDevicesExist,
    endMediaStream,
    setMediaStream,
    onMediaDeviceChange
  } = useMediaStream();
  const { audioDevice, videoDevice } = useMediaConfigurations();
  const { socket } = useContext(WebSocketContext);
  const { chats } = useChatList();

  useEffect(() => {
    onMediaDeviceChange();
  }, [audioDevice, videoDevice]);

  useEffect(() => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      const audioTracks = mediaStream.getAudioTracks();

      videoTracks.forEach((track) => (track.enabled = peerCallState.userState.video));
      audioTracks.forEach((track) => (track.enabled = !peerCallState.userState.muted));

      setMediaStream(mediaStream);
    }
  }, [peerCallState.userState, mediaStream]);

  useEffect(() => {
    if (socket && peerCallState.receiverId) {
      socket.emit("receiver_state", peerCallState.receiverId, peerCallState.userState);

      if (peerCallState.userState.sharingScreen && !displayMediaStream) {
        addDisplayStreamToPeer();
      } else if (!peerCallState.userState.sharingScreen && displayMediaStream) {
        peerCallState.peer.removeStream(displayMediaStream);
        asyncEndDisplayMediaStream();
      }
    }
  }, [peerCallState.userState, peerCallState.receiverId]);

  const addDisplayStreamToPeer = async () => {
    const stream = await waitForDisplayMediaStream();
    if (peerCallState.peer && stream) {
      peerCallState.peer.addStream(stream);
    } else {
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("reject_call", () => {
      resetCallState();
      toast("The user is unable to take calls right now", { type: "error" });
    });

    socket.on("incoming_call", (receiverId: string) => {
      const peerCallState = usePeerCallState.getState();

      if (peerCallState.callStatus !== "idle") {
        rejectCall("BUSY", receiverId);
      } else {
        peerCallState.setReceiverProfile(findUserFromChat(useChatList.getState().chats, receiverId));
        peerCallState.setReceiverId(receiverId);
        peerCallState.setStatus("call_incoming");
      }
    });

    socket.on("call_rejected", (reason: RejectReason) => {
      const peerCallState = usePeerCallState.getState();

      peerCallState.setReceiverId(null);
      peerCallState.setStatus("idle");
    });

    socket.on("call_accepted", callAccepted.bind(this, socket));

    socket.on("signal_data", receiveSignalData);

    socket.on("receiver_state", updateReceiverState);

    socket.on("end_call", resetCallState);

    socket.on("update_friend_status", (msg) => {
      const { chats, setChats } = useChatList.getState();
      const { chat, setChat } = useChat.getState();

      onCallDisconnect(msg);
      if (chats)
        setChats(
          chats.map((chat) => {
            const newParticipants = chat.chat.participants.map((participant) => {
              if (participant.user.oauthId === msg.oauthId) {
                return {
                  ...participant,
                  user: { ...participant.user, ...msg, isTyping: false },
                };
              } else return participant;
            });
            chat.chat.participants = newParticipants;
            return chat;
          })
        );
      if (chat) {
        const newParticipants = chat.participants.map((participant) => {
          if (participant.user.oauthId === msg.oauthId) {
            return {
              ...participant,
              user: { ...participant.user, ...msg, isTyping: false },
            };
          } else return participant;
        });
        chat.participants = newParticipants;
        setChat(chat);
      }
    });
  }, [socket]);

  const rejectCall = (reason: RejectReason, receiverId?: string) => {
    socket.emit("reject_call", receiverId ?? peerCallState.receiverId);
  };

  const acceptCall = async (video: boolean) => {
    try {
      const availableMedia = await checkDevicesExist(true, true);
      const mediaStream = await waitForMediaStream(availableMedia.videoEnabled, availableMedia.audioEnabled);

      const newPeer = new Peer({ initiator: true, trickle: false, stream: mediaStream });
      peerCallState.setUserState({
        muted: !availableMedia.audioEnabled,
        video: availableMedia.videoEnabled && video,
        deafened: false,
        sharingScreen: false,
      });
      newPeer.on("connect", () => {
        peerCallState.setStatus("call");
      });
      newPeer.on("signal", (signalData) => {
        const { receiverId } = usePeerCallState.getState();
        socket.emit("signal_data", receiverId, signalData);
      });
      newPeer.on("stream", (stream: MediaStream) => {
        const { receiverStream, setReceiverStream } = usePeerCallState.getState();
        setReceiverStream([...receiverStream, stream]);
      });
      newPeer.on("error", (error) => {
        console.error(error);
      });
      newPeer.on("end", () => {
        resetCallState();
      });
      peerCallState.setPeer(newPeer);
      peerCallState.setStatus("rtc_connecting");
      socket.emit("accept_call", peerCallState.receiverId);
    } catch (error) {
      console.error(error);
    }
  };

  const endCall = () => {
    socket.emit("end_call", peerCallState.receiverId);
    resetCallState();
  };

  const resetCallState = () => {
    peerCallState.setStatus("idle");
    peerCallState.setReceiverId(null);
    peerCallState.resetCallState();
    if (peerCallState.peer) {
      peerCallState.peer.end();
      peerCallState.setPeer(null);
    }
    endMediaStream();
    asyncEndDisplayMediaStream();
  };

  const makeCall = async (receiverId: string, video: boolean = false) => {
    try {
      socket.emit("make_call", receiverId, video);
      peerCallState.setStatus("call_outgoing");
      peerCallState.setReceiverId(receiverId);
      peerCallState.setReceiverProfile(findUserFromChat(chats, receiverId));
      const availableMedia = await checkDevicesExist(video, true);
      await waitForMediaStream(availableMedia.videoEnabled, availableMedia.audioEnabled);
      peerCallState.setUserState({
        muted: availableMedia.audioEnabled,
        video: availableMedia.videoEnabled,
        deafened: false,
        sharingScreen: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const callAccepted = async (socket: Socket, receiverId: string) => {
    const callState = usePeerCallState.getState();
    const { mediaStream } = useMediaStreamState.getState();
    if (receiverId !== callState.receiverId) return;
    try {
      const newPeer = new Peer({ initiator: false, trickle: false, stream: mediaStream });
      newPeer.on("connect", () => {
        callState.setStatus("call");
      });
      newPeer.on("signal", (data) => {
        socket.emit("signal_data", receiverId, data);
      });
      newPeer.on("stream", (stream: MediaStream) => {
        const { receiverStream, setReceiverStream } = usePeerCallState.getState();
        setReceiverStream([...receiverStream, stream]);
      });
      newPeer.on("error", (error) => {
        console.error(error);
      });
      callState.setPeer(newPeer);
      if (callState.callStatus === "call_outgoing") {
        callState.setStatus("rtc_connecting");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const receiveSignalData = (_receiverId: string, signalData: Peer.SignalData) => {
    const { peer, setStatus } = usePeerCallState.getState();
    if (peer) {
      try {
        peer.signal(signalData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateReceiverState = (receiverState: UserCallOptions) => {
    const peerCallState = usePeerCallState.getState();
    peerCallState.setReceiverState(receiverState);
    if (!receiverState.sharingScreen) {
      const receiverStreams = peerCallState.receiverStream;
      if (receiverStreams && receiverStreams.length > 1) peerCallState.setReceiverStream([receiverStreams[0]]);
    }
  };

  const onCallDisconnect = (msg) => {
    const peerCallState = usePeerCallState.getState();
    if (!msg.online) {
      if (peerCallState.receiverId === msg.oauthId) {
        resetCallState();
      }
    }
  };

  return <PeerCallContext.Provider value={{ acceptCall, makeCall, endCall }}>{children}</PeerCallContext.Provider>;
};

export default PeerCallWrapper;
