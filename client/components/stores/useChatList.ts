import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IChatListItem } from "../modules/ChatList/ChatListItem";

interface IUseChatList extends State {
  chats: IChatListItem[];
  setChats: (chats: IChatListItem[]) => void;
}

const useChatList = create<IUseChatList>(
  combine({ chats: null }, (set) => ({
    setChats: (chats: IChatListItem[]) => {
      set({ chats });
    },
  }))
);

export default useChatList;
