import React, { useContext } from "react";
import styles from "./RecievedRequestsTab.module.css";
import TimeAgo from "react-timeago";

import { WebSocketContext } from "../../providers/WebSocketProvider";
import GreenTickIcon from "../../statics/icons/GreenTickIcon";
import RedCrossIcon from "../../statics/icons/RedCrossIcon";
import useFriendRequests from "../../stores/useFriendRequests";

export default function RecievedRequestsTab() {
  const { socket } = useContext(WebSocketContext);
  const { friendRequests } = useFriendRequests();

  const acceptFriendRequest = (userId: string) => {
    if (!socket) return;
    socket.emit("accept_friend_request", { userId });
  };

  const ignoreFriendRequest = (userId: string) => {
    if (!socket) return;
    socket.emit("ignore_friend_request", { userId });
  };

  return (
    <div className={styles.body}>
      {friendRequests.map(
        (friend) =>
          !friend.ignored && (
            <div key={friend.user.oauthId} className={styles.listItem}>
              <div className={styles.infoDiv}>
                <img
                  src={friend.user.avatarUrl}
                  alt="request"
                  height="38"
                  width="38"
                />
                <p>{friend.user.name}</p>
                <TimeAgo date={friend.createdAt} />
              </div>
              <div className={styles.btnHolder}>
                <button
                  className={styles.acceptBtn}
                  onClick={acceptFriendRequest.bind(this, friend.user.oauthId)}
                >
                  <GreenTickIcon />
                </button>
                <button
                  className={styles.acceptBtn}
                  onClick={ignoreFriendRequest.bind(this, friend.user.oauthId)}
                >
                  <RedCrossIcon />
                </button>
              </div>
            </div>
          )
      )}
    </div>
  );
}
