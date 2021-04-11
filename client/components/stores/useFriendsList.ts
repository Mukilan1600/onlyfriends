import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { IFriendsListItem } from "../modules/FriendsList/FriendsListItem";

interface IUseFriendsList extends State {
  friends: IFriendsListItem[];
  setFriends: (friends: IFriendsListItem[]) => void;
}

const useFriendsList = create<IUseFriendsList>(
  combine({ friends: [] }, (set) => ({
    setFriends: (friends: IFriendsListItem[]) => {
      set({ friends });
    },
  }))
);

export default useFriendsList;
