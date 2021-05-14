import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { useContext } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";

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
  isVideo: boolean;
}

interface IUseCallState extends IUseCallStateProps {
  setReceiverId: (receiverId: string) => void;
  setStatus: (status: CallStatus) => void;
  setIsVideo: (isVideo: boolean) => void;
  setRejectReason: (rejectReason: RejectReason) => void;
}

const initialState: IUseCallStateProps = {
  rejectReason: null,
  callStatus: "idle",
  receiverId: null,
  isVideo: false,
};

const useCallState = create<IUseCallState>(
  combine(initialState, (set) => ({
    setReceiverId: (receiverId: string) => set({ receiverId }),
    setStatus: (status: CallStatus) => set({ callStatus: status }),
    setIsVideo: (isVideo: boolean) => set({ isVideo }),
    setRejectReason: (rejectReason: RejectReason) => set({ rejectReason }),
  }))
);

const useCall = () => {
  const callState = useCallState();
  const { socket } = useContext(WebSocketContext);

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

  const makeCall = (receiverId: string, video: boolean = false) => {
    socket.emit("make_call", receiverId, video);
    callState.setStatus("call_outgoing");
    callState.setReceiverId(receiverId);
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
