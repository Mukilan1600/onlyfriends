import React, { useContext, useEffect, useState } from "react";
import styles from './RecievedRequestsTab.module.css'
import TimeAgo from 'react-timeago'

import { WebSocketContext } from "../../providers/WebSocketProvider";
import { IUser } from "../../stores/useProfile";
import GreenTickIcon from "../../statics/icons/GreenTickIcon";

interface IFriendRequest{
  user: IUser,
  createdAt: Date,
  ignored: boolean
}

export default function RecievedRequestsTab() {
  const { socket } = useContext(WebSocketContext);
  const [friendRequests, setFriendRequests] = useState<IFriendRequest[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("get_friend_requests");
    socket.on("friend_requests", (msg) => setFriendRequests(msg));
    return () => {
      socket.off("friend_requests");
    };
  }, [socket]);

  return (
    <div className={styles.body}>
      {friendRequests.map((friend) => (
        <div key={friend.user.oauthId} className={styles.listItem}>
          <div className={styles.infoDiv}>
            <img src={friend.user.avatarUrl} alt="request" height="38" width="38"/>
            <p>{friend.user.name}</p>
            <TimeAgo date={friend.user.lastSeen} />
          </div>
          <div>
            <button className={styles.acceptBtn}><GreenTickIcon /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
