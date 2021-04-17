import React from "react";
import styles from "./ChatListItem.module.css";
import { IUser } from "../../stores/useProfile";
import ReactTimeago from "react-time-ago";

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
      else{
        return (
          <>
            <span style={{marginRight: '4px'}}>Last seen</span><ReactTimeago date={new Date(chat.participants[0].lastSeen)} locale="en-US" timeStyle="round-minute"/>
          </>
        );

      }

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
