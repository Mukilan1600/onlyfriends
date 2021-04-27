import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IMessage } from "./useChat";

interface IUseMessage extends State {
  replyTo: IMessage;
  setReplyTo: (messageId: IMessage) => void;
}

const useMessage = create<IUseMessage>(
  combine({ replyTo: null }, (set) => ({
    setReplyTo: (messageId: IMessage) => {
      set({ replyTo: messageId });
    },
  }))
);

export default useMessage;
