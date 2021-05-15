import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { useContext } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import { IUser } from "./useProfile";
import useChatList from "./useChatList";
import { IChatListItem } from "../modules/ChatList/ChatListItem";
import useMediaStream from "./call/useMediaStream";
import useMediaConfigurations from "./call/useMediaConfiguration";

type CallStatus =
  | "idle"
  | "call"
  | "call_outgoing"
  | "call_incoming"
  | "call_rejected";
export type RejectReason = "BUSY" | "REJECT";

interface IUseCallStateProps extends State {
  rejectReason: RejectReason;
  callStatus: CallStatus;
  receiverId: string;
  receiverProfile: IUser;
  isVideo: boolean;
}

interface IUseCallState extends IUseCallStateProps {
  setReceiverId: (receiverId: string) => void;
  setReceiverProfile: (receiverProfile: IUser) => void;
  setStatus: (status: CallStatus) => void;
  setIsVideo: (isVideo: boolean) => void;
  setRejectReason: (rejectReason: RejectReason) => void;
}

const initialState: IUseCallStateProps = {
  rejectReason: null,
  callStatus: "idle",
  receiverId: null,
  receiverProfile: null,
  isVideo: false,
};

const useCallState = create<IUseCallState>(
  combine(initialState, (set) => ({
    setReceiverId: (receiverId: string) => set({ receiverId }),
    setStatus: (status: CallStatus) => set({ callStatus: status }),
    setIsVideo: (isVideo: boolean) => set({ isVideo }),
    setRejectReason: (rejectReason: RejectReason) => set({ rejectReason }),
    setReceiverProfile: (receiverProfile: IUser) => set({ receiverProfile }),
  }))
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
  const { mediaStream, getMediaStream } = useMediaStream();

  const rejectCall = (reason: RejectReason, receiverId?: string) => {
    socket.emit("reject_call", receiverId ?? callState.receiverId, reason);
    callState.setReceiverId(null);
  };

  const acceptCall = () => {
    socket.emit("accept_call", callState.receiverId);
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

  return {
    callState,
    rejectCall,
    acceptCall,
    cancelCall,
    makeCall,
  };
};

export default useCall;
