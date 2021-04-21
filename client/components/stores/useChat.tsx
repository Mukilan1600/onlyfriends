import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IChat } from "../modules/ChatList/ChatListItem";

interface IMessage {
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
  setChat: (chat: IChat) => void;
  setMessages: (messages: IMessage[]) => void;
}

const useChat = create<IUseChat>(
  combine({ chat: null, messages: [] }, (set, get) => ({
    setChat: (chat: IChat) => {
      set({ chat, messages: [] });
    },
    setMessages: (messages: IMessage[]) => {
      set({ ...get(), messages });
    },
  }))
);

export default useChat;
