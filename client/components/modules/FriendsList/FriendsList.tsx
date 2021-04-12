import React, { useContext, useEffect } from "react";
import Link from "next/link";
import styles from './FriendsList.module.css'

import { WebSocketContext } from "../../providers/WebSocketProvider";
import FriendsListItem from "./FriendsListItem";
import useFriendsList from "../../stores/useFriendsList";

const FriendsList: React.FC = () => {
  const { friends, setFriends } = useFriendsList();
  const { socket } = useContext(WebSocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on("friends_list", (msg) => setFriends(msg));
    socket.on("update_friend_status", (msg) => {
      const {friends} = useFriendsList.getState();
      setFriends(
        friends.map((friend) => {
          if (friend.user.oauthId === msg.oauthId) {
            friend.user.lastSeen = msg.lastSeen;
            friend.user.online = msg.online;
          }
          return friend;
        })
      );
    });

    socket.emit("get_friends_list");
    return () => {
      socket.off("friends_list");
      socket.off("update_friend_status");
    };
  }, [socket]);

  return (
    <div className={styles.body}>
      {friends &&
        friends.map((friend) => (
          <FriendsListItem
            key={friend.user.oauthId}
            user={friend.user}
            chat={friend.chat}
          />
        ))}
      <Link href="/friendrequests"><div className={styles.btnAddFriends}>Friend Requests</div></Link>
    </div>
  );
};

export default FriendsList;
