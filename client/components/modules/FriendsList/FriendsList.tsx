import React, { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import FriendsListItem, { IFriendsListItem } from "./FriendsListItem";

const FriendsList: React.FC = () => {
  const [friends, setFriends] = useState<[IFriendsListItem]>(null);
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on("friends_list", (msg) => setFriends(msg));
    socket.emit("get_friends_list");
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
