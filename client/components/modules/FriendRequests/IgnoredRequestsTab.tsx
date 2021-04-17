import React from "react";
import styles from "./RecievedRequestsTab.module.css";
import TimeAgo from "react-time-ago";

import useFriendRequests from "../../stores/useFriendRequests";

export default function IgnoredRequestsTab() {
  const { friendRequests } = useFriendRequests();

  return (
    <div className={styles.body}>
      {friendRequests.map(
        (friend) =>
          friend.ignored && (
            <div key={friend.user.oauthId} className={styles.listItem}>
              <div className={styles.infoDiv}>
                <img
                  src={friend.user.avatarUrl}
                  alt="request"
                  height="38"
                  width="38"
                />
                <p>{friend.user.name}</p>
                <TimeAgo date={friend.createdAt}  />
              </div>
            </div>
          )
      )}
    </div>
  );
}
