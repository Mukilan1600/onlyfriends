import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IChatListItem } from "../modules/ChatList/ChatListItem";

interface IUseFileUpload extends State {
  file: File;
  setFile: (file: File) => void;
}

const useFileUpload = create<IUseFileUpload>(
  combine({ file: null }, (set) => ({
    setFile: (file: File) => {
      set({ file });
    },
  }))
);

export default useFileUpload;
