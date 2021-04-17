import React from "react";
import styles from "./ChatListItem.module.css";
import { IUser } from "../../stores/useProfile";

type IChat = {
  type: "personal" | "group";
  participants: IUser[];
  createdAt: string;
};

export interface IChatListItem {
  chat: IChat;
  unread: number;
}

const ChatListItem: React.FC<IChatListItem> = ({ chat }) => {
  const getStatusDiv = () => {
    if (chat.type === "personal") {
      if (chat.participants[0].online)
        return (
          <>
            <div className={styles.statusRingOnline} />
            <p>Online</p>
          </>
        );
      else
        return (
          <>
            <div className={styles.statusRingOffline} />
            <p>Offline</p>
          </>
        );
    }
  };

  const getAvatarUrl = () => {
    if (chat.type === "personal") {
      return chat.participants[0].avatarUrl;
    }
  };

  const getChatName = () => {
    if (chat.type === "personal") {
      return chat.participants[0].name;
    }
  };

  return (
    <div className={styles.friendItem}>
      <div className={styles.friendImgContainer}>
        <img
          src={getAvatarUrl()}
          alt="user"
          height="38px"
          width="38px"
          className={styles.friendImg}
        />
        <p>{getChatName()}</p>
      </div>
      <div className={styles.friendStatus}>{getStatusDiv()}</div>
    </div>
  );
};

export default ChatListItem;
