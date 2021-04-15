import React from "react";
import styles from "./FriendsListItem.module.css";
import { IUser } from "../../stores/useProfile";

export interface IFriendsListItem {
  user: IUser;
  chat: string;
}

const FriendsListItem: React.FC<IFriendsListItem> = ({ user, chat }) => {
  const getStatusDiv = (status: boolean) => {
    if (status)
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
  };

  return (
    <div className={styles.friendItem}>
      <div className={styles.friendImgContainer}>
        <img
          src={user.avatarUrl}
          alt="user"
          height="38px"
          width="38px"
          className={styles.friendImg}
        />
        <p>{user.name}</p>
      </div>
      <div className={styles.friendStatus}>{getStatusDiv(user.online)}</div>
    </div>
  );
};

export default FriendsListItem;
