import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import { IUser } from "./useProfile";

type IFriendRequest = {
  user: IUser;
  createdAt: Date;
  ignored: boolean;
};

interface IFriendRequests extends State {
  friendRequests: IFriendRequest[];
  setFriendRequests: (requests: IFriendRequest[]) => void;
}

const useFriendRequestsState = create<IFriendRequests>(
  combine({ friendRequests: [] }, (set) => ({
    setFriendRequests: (requests: IFriendRequest[]) =>
      set({ friendRequests: requests }),
  }))
);

const useFriendRequests = () => {
  const { socket } = useContext(WebSocketContext);
  const { friendRequests, setFriendRequests } = useFriendRequestsState();

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_friend_requests");
    socket.on("friend_requests", (msg) => setFriendRequests(msg));
    socket.on("friend_request_accepted", (msg) => {
      const friendRequests = useFriendRequestsState.getState().friendRequests;
      setFriendRequests(
        [...friendRequests].filter((request) => request.user.oauthId !== msg)
      );
    });
    return () => {
      socket.off("friend_requests");
      socket.off("friend_request_accepted");
    };
  }, [socket]);

  return { friendRequests };
};

export default useFriendRequests;
