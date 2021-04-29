import React from "react";
import styles from "./ChatListItem.module.css";
import { IUser } from "../../stores/useProfile";
import ReactTimeago from "react-time-ago";
import Link from "next/link";
import { useRouter } from "next/router";

export type IChat = {
  _id: string;
  type: "personal" | "group";
  participants: { unread: number; user: IUser }[];
  createdAt: string;
};

export interface IChatListItem {
  chat: IChat;
  unread: number;
}

const ChatListItem: React.FC<IChatListItem> = ({ unread, chat }) => {
  const router = useRouter();
  const getStatusDiv = () => {
    if (chat.type === "personal") {
      if (chat.participants[0].user.online)
        return (
          <>
            <div className={styles.statusRingOnline} />
            <p>Online</p>
          </>
        );
      else {
        return (
          <>
            <span style={{ marginRight: "4px" }}>Last seen</span>
            <ReactTimeago
              date={new Date(chat.participants[0].user.lastSeen)}
              locale="en-US"
              timeStyle="round-minute"
            />
          </>
        );
      }
    }
  };

  const getAvatarUrl = () => {
    if (chat.type === "personal") {
      return chat.participants[0].user.avatarUrl;
    }
  };

  const getChatName = () => {
    if (chat.type === "personal") {
      return chat.participants[0].user.name;
    }
  };

  return (
    <Link href={`/chat/${chat._id}`}>
      <div
        className={`${styles.friendItem} ${
          chat._id === router.query.id && styles.itemActive
        }`}
      >
        <div className={styles.friendImgContainer}>
          <img
            src={getAvatarUrl()}
            alt="user"
            height="38px"
            width="38px"
            className={styles.friendImg}
          />
          <p>{getChatName()}</p>
          {unread > 0 && <div className={styles.unreadDiv}>{unread}</div>}
        </div>
        <div className={styles.friendStatus}>{getStatusDiv()}</div>
      </div>
    </Link>
  );
};

export default ChatListItem;
