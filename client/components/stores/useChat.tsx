import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IChat } from "../modules/ChatList/ChatListItem";

export interface IMessage {
  type: "message" | "file" | "reply";
  reply: boolean;
  replyTo?: string;
  fileUrl?: string;
  message?: string;
  createdAt?: Date;
}

interface IUseChat extends State {
  chat: IChat;
  messages: IMessage[];
  offset: number;
  setChat: (chat: IChat) => void;
  setMessages: (messages: IMessage[]) => void;
  resetChat: () => void;
}

const useChat = create<IUseChat>(
  combine({ chat: null, messages: [], offset: 0 }, (set, get) => ({
    setChat: (chat: IChat) => {
      set({ chat, messages: [] });
    },
    setMessages: (messages: IMessage[]) => {
      const state = get();
      set({ ...state, messages, offset: state.offset + 1 });
    },
    resetChat: () => {
      set({ chat: null, messages: [], offset: 0 });
    },
  }))
);

export default useChat;
