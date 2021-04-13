import React from "react";
import AddNewFriends from "./AddNewFriends";
import RequestsTabs from "./RequestsTabs";

import styles from './FriendRequests.module.css'

const FriendRequests: React.FC = () => {
  return (
    <div className={styles.body}>
      <AddNewFriends />
      <RequestsTabs />
    </div>
  );
};

export default FriendRequests;
