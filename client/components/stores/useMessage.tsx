import create, { State } from "zustand";
import { combine } from "zustand/middleware";

interface IUseMessage extends State {
  replyTo: string;
  setReplyTo: (messageId: string) => void;
}

const useMessage = create<IUseMessage>(
  combine({ replyTo: null }, (set) => ({
    setReplyTo: (messageId: string) => {
      set({ replyTo: messageId });
    },
  }))
);

export default useMessage;
