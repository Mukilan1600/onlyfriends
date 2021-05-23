import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IChat } from "../modules/ChatList/ChatListItem";
import { IUser } from "./useProfile";

export interface IMessageFragment {
  type: "emote" | "text" | "link";
  id?: string;
  msg?: string;
}

export interface IMessage {
  _id?: string;
  type: "message" | "file" | "reply";
  sentBy?: string;
  reply?: boolean;
  replyTo?: string | IMessage;
  fileUrl?: string;
  fileName?: string;
  fileType?: "file" | "image" | "video";
  message?: IMessageFragment[];
  createdAt?: Date;
  readBy?: string[];
}

interface IUseChat extends State {
  chat: IChat;
  messages: IMessage[];
  unacknowledgedMessages: IMessage[];
  reachedEnd: boolean;
  setChat: (chat: IChat) => void;
  setMessages: (messages: IMessage[]) => void;
  setUnacknowledgedMessages: (unacknowledgedMessages: IMessage[]) => void;
  resetChat: () => void;
  setReachedEnd: (reached: boolean) => void;
}

const useChat = create<IUseChat>(
  combine({ chat: null, messages: [], unacknowledgedMessages: [], reachedEnd: false }, (set, get) => ({
    setChat: (chat: IChat) => {
      set({ chat });
    },
    setMessages: (messages: IMessage[]) => {
      set({ messages });
    },
    setUnacknowledgedMessages: (unacknowledgedMessages: IMessage[]) => {
      set({ unacknowledgedMessages });
    },
    setReachedEnd: (reached: boolean) => {
      set({ reachedEnd: reached });
    },
    resetChat: () => {
      set({ chat: null, messages: [], reachedEnd: false });
    },
  }))
);

export default useChat;
