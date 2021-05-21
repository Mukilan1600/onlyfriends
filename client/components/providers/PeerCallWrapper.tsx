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

type CallStatus = "idle" | "call" | "call_outgoing" | "call_incoming";
export type RejectReason = "BUSY" | "REJECT";

interface UserCallOptions {
  muted: boolean;
  video: boolean;
  deafened: boolean;
}

interface IPeerCallState extends State {
  userState: UserCallOptions;
  callStatus: CallStatus;
  receiverId: string;
  receiverProfile: IUser;
  receiverStream: MediaStream;
  receiverState: UserCallOptions;
  peer: Peer.Instance;
}

const initialCallOptions: UserCallOptions = {
  muted: true,
  video: false,
  deafened: false,
};

const initialPeerCallState: IPeerCallState = {
  userState: initialCallOptions,
  callStatus: "idle",
  receiverId: null,
  receiverProfile: null,
  receiverStream: null,
  peer: null,
  receiverState: initialCallOptions,
};

interface IPeerCallStateSetters extends IPeerCallState {
  setReceiverId: (receiverId: string) => void;
  setReceiverProfile: (receiverProfile: IUser) => void;
  setStatus: (status: CallStatus) => void;
  setRejectReason: (rejectReason: RejectReason) => void;
  setReceiverStream: (receiverStream: MediaStream) => void;
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
    setReceiverStream: (receiverStream: MediaStream) => set({ receiverStream }),
    setPeer: (peer: Peer.Instance) => set({ peer }),
    setReceiverState: (receiverState: UserCallOptions) => set({ receiverState }),
    setUserState: (userState: UserCallOptions) => set({ userState }),
    resetCallState: () =>
      set({
        receiverState: initialCallOptions,
        userState: initialCallOptions,
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
  const { mediaStream, waitForMediaStream, checkDevicesExist, endMediaStream, asyncEndMediaStream } = useMediaStream();
  const { socket } = useContext(WebSocketContext);
  const { chats } = useChatList();

  useEffect(() => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      const audioTracks = mediaStream.getAudioTracks();

      videoTracks.forEach((track) => (track.enabled = peerCallState.userState.video));
      audioTracks.forEach((track) => (track.enabled = !peerCallState.userState.muted));
    }
  }, [peerCallState.userState, mediaStream]);

  useEffect(() => {
    if (socket && peerCallState.receiverId) socket.emit("receiver_state", peerCallState.receiverId, peerCallState.userState);
  }, [peerCallState.userState, peerCallState.receiverId]);

  useEffect(() => {
    if (!socket) return;
    socket.on("incoming_call", (receiverId: string) => {
      const peerCallState = usePeerCallState.getState();

      if (peerCallState.callStatus === "call_incoming" || peerCallState.callStatus === "call") {
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
    socket.emit("reject_call", receiverId ?? peerCallState.receiverId, reason);
    peerCallState.setReceiverId(null);
  };

  const acceptCall = async (video: boolean) => {
    try {
      const availableMedia = await checkDevicesExist(video, true);
      const mediaStream = await waitForMediaStream(availableMedia.videoEnabled, availableMedia.audioEnabled);

      const newPeer = new Peer({ initiator: true, stream: mediaStream });
      peerCallState.setUserState({
        muted: !availableMedia.audioEnabled,
        video: availableMedia.videoEnabled,
        deafened: false,
      });
      newPeer.on("signal", (signalData) => {
        const { callStatus, receiverId, setStatus } = usePeerCallState.getState();
        if (callStatus === "call_incoming") {
          socket.emit("accept_call", receiverId, signalData);
          setStatus("call");
        } else {
          socket.emit("signal_data", receiverId, signalData);
        }
      });
      newPeer.on("stream", (stream: MediaStream) => {
        peerCallState.setReceiverStream(stream);
      });
      newPeer.on("error", (error) => {
        console.error(error);
      });
      newPeer.on("close", () => {
        console.log("Peer closed");
      });
      peerCallState.setPeer(newPeer);
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
    asyncEndMediaStream();
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
      });
    } catch (error) {
      console.error(error);
    }
  };

  const callAccepted = async (socket: Socket, receiverId: string, signalData: Peer.SignalData) => {
    const callState = usePeerCallState.getState();
    const { mediaStream } = useMediaStreamState.getState();
    if (receiverId !== callState.receiverId) return;
    try {
      const newPeer = new Peer({ initiator: false, stream: mediaStream });
      newPeer.signal(signalData);
      newPeer.on("signal", (data) => {
        const callState = usePeerCallState.getState();
        socket.emit("signal_data", receiverId, data);
        if (callState.callStatus === "call_outgoing") {
          callState.setStatus("call");
        }
      });
      newPeer.on("stream", (stream: MediaStream) => {
        callState.setReceiverStream(stream);
      });
      newPeer.on("error", (error) => {
        console.error(error);
      });
      callState.setPeer(newPeer);
    } catch (err) {
      console.log(err);
    }
  };

  const receiveSignalData = (_receiverId: string, signalData: Peer.SignalData) => {
    const { peer } = usePeerCallState.getState();
    if (peer) {
      console.log(signalData);
      try {
        peer.signal(signalData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const updateReceiverState = (receiverState: UserCallOptions) => {
    peerCallState.setReceiverState(receiverState);
  };

  const onCallDisconnect = (msg) => {
    const peerCallState = usePeerCallState.getState();
    if (!msg.online) {
      if (peerCallState.receiverId === msg.oauthId) {
        peerCallState.setStatus("idle");
        peerCallState.setReceiverId(null);
        peerCallState.setReceiverProfile(null);
        peerCallState.resetCallState();
        endMediaStream();
      }
    }
  };

  return <PeerCallContext.Provider value={{ acceptCall, makeCall, endCall }}>{children}</PeerCallContext.Provider>;
};

export default PeerCallWrapper;
