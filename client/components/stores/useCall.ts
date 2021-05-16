import create, { State } from "zustand";
import { combine, devtools } from "zustand/middleware";
import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import useProfile, { IUser } from "./useProfile";
import useChatList from "./useChatList";
import { IChatListItem } from "../modules/ChatList/ChatListItem";
import useMediaStream, { useMediaStreamState } from "./call/useMediaStream";
import useMediaConfigurations from "./call/useMediaConfiguration";
import Peer from "simple-peer";
import { Socket } from "socket.io-client";

type CallStatus =
  | "idle"
  | "call"
  | "call_outgoing"
  | "call_incoming"
  | "call_rejected"
  | "call_ended";
export type RejectReason = "BUSY" | "REJECT";

interface IUseCallStateProps extends State {
  rejectReason: RejectReason;
  callStatus: CallStatus;
  receiverId: string;
  receiverProfile: IUser;
  isVideo: boolean;
  receiverStream: MediaStream;
  peer: Peer.Instance;
}

interface IUseCallState extends IUseCallStateProps {
  setReceiverId: (receiverId: string) => void;
  setReceiverProfile: (receiverProfile: IUser) => void;
  setStatus: (status: CallStatus) => void;
  setIsVideo: (isVideo: boolean) => void;
  setRejectReason: (rejectReason: RejectReason) => void;
  setReceiverStream: (receiverStream: MediaStream) => void;
  setPeer: (peer: Peer.Instance) => void;
}

const initialState: IUseCallStateProps = {
  rejectReason: null,
  callStatus: "idle",
  receiverId: null,
  receiverProfile: null,
  isVideo: false,
  receiverStream: null,
  peer: null,
};

const useCallState = create<IUseCallState>(
  devtools(
    combine(initialState, (set) => ({
      setReceiverId: (receiverId: string) => set({ receiverId }),
      setStatus: (status: CallStatus) => set({ callStatus: status }),
      setIsVideo: (isVideo: boolean) => set({ isVideo }),
      setRejectReason: (rejectReason: RejectReason) => set({ rejectReason }),
      setReceiverProfile: (receiverProfile: IUser) => set({ receiverProfile }),
      setReceiverStream: (receiverStream: MediaStream) =>
        set({ receiverStream }),
      setPeer: (peer: Peer.Instance) => set({ peer }),
    }))
  )
);

export const findUserFromChat = (chats: IChatListItem[], userId: string) => {
  const chat = chats.find((chat) => {
    return (
      chat.chat.participants[0].user.oauthId === userId &&
      chat.chat.type === "personal"
    );
  });
  if (chat) return chat.chat.participants[0].user;
  else return null;
};

const useCall = () => {
  const callState = useCallState();
  const { setVideoEnabled, setAudioEnabled, videoEnabled } =
    useMediaConfigurations();
  const { socket } = useContext(WebSocketContext);
  const { chats } = useChatList();
  const { getMediaStream, mediaStream } = useMediaStream();

  useEffect(() => {
    if (callState.callStatus === "call" && callState.peer) {
      callState.peer.addStream(mediaStream);
    }
  }, [mediaStream]);

  const make_peer_call = async (video: boolean) => {
    const stream = await getMediaStream({
      videoEnabled: video,
      audioEnabled: true,
    });
    const newPeer = new Peer({ initiator: true, stream: stream });
    return newPeer;
  };

  const rejectCall = (reason: RejectReason, receiverId?: string) => {
    socket.emit("reject_call", receiverId ?? callState.receiverId, reason);
    callState.setReceiverId(null);
  };

  const acceptCall = async (video: boolean = false) => {
    try {
      const newPeer = await make_peer_call(video);
      newPeer.on("signal", (signalData) => {
        const { callStatus, receiverId, setStatus } = useCallState.getState();
        if (callStatus === "call_incoming") {
          socket.emit("accept_call", receiverId, signalData);
          setStatus("call");
        } else {
          socket.emit("signal_data", receiverId, signalData);
        }
      });
      newPeer.on("stream", (stream: MediaStream) => {
        callState.setReceiverStream(stream);
      });
      newPeer.on("error", (error) => {
        console.error(error);
      });
      callState.setPeer(newPeer);
    } catch (error) {}
  };

  const cancelCall = () => {
    callState.setStatus("idle");
    callState.setReceiverId(null);
  };

  const makeCall = async (receiverId: string, video: boolean = false) => {
    socket.emit("make_call", receiverId, video);
    callState.setStatus("call_outgoing");
    callState.setReceiverId(receiverId);
    callState.setReceiverProfile(findUserFromChat(chats, receiverId));
    setVideoEnabled(video);
    setAudioEnabled(true);
    getMediaStream({ videoEnabled: video, audioEnabled: true });
  };

  const callAccepted = async (
    socket: Socket,
    receiverId: string,
    signalData: Peer.SignalData
  ) => {
    const callState = useCallState.getState();
    const { mediaStream } = useMediaStreamState.getState();
    if (receiverId !== callState.receiverId) return;
    try {
      const newPeer = new Peer({ initiator: false, stream: mediaStream });
      newPeer.signal(signalData);
      newPeer.on("signal", (data) => {
        const callState = useCallState.getState();
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

  const receiveSignalData = (
    receiverId: string,
    signalData: Peer.SignalData
  ) => {
    const { peer } = useCallState.getState();
    peer.signal(signalData);
  };

  const onCallDisconnect = (msg) => {
    const callState = useCallState.getState();
    if (!msg.online) {
      if (callState.receiverId === msg.oauthId) {
        switch (callState.callStatus) {
          case "call":
            callState.setStatus("call_ended");
            break;
          case "call_incoming":
            callState.setStatus("idle");
            callState.setReceiverId(null);
            callState.setReceiverProfile(null);
            break;
          case "call_outgoing":
            callState.setStatus("call_ended");
            break;
        }
      }
    }
  };

  return {
    callState,
    rejectCall,
    acceptCall,
    cancelCall,
    makeCall,
    callAccepted,
    receiveSignalData,
    onCallDisconnect,
  };
};

export default useCall;
