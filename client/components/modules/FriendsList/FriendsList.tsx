import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import FriendsListItem, { IFriendsListItem } from "./FriendsListItem";

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<[IFriendsListItem]>(null);
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on("friends_list", (msg) => setFriends(msg));
    socket.on("update_friend_status", (msg) => console.log(msg));
    socket.emit("get_friends_list");
    return () => {
      socket.off("friends_list");
      socket.off("update_friend_status");
    };
  }, [socket]);

  return (
    <div>
      {friends &&
        friends.map((friend) => (
          <FriendsListItem
            key={friend.user.oauthId}
            user={friend.user}
            chat={friend.chat}
          />
        ))}
    </div>
  );
};

export default FriendsList;
