import React from "react";
import EditIcon from "../statics/icons/EditIcon";
import useProfile from "../stores/useProfile";
import styles from "./NavbarProfileModal.module.css";

export default function NavbarProfileModal() {
  const { user } = useProfile();
  return (
    <div className={styles.profileModalDiv}>
      <img src={user.avatarUrl} alt="User" id={styles.profileModalImg} />
      <div id={styles.profileModalUsernameDiv}>
        <p id={styles.profileModalUsername}>{user.username}</p>
        <EditIcon />
      </div>
      <div className={styles.divider} />
    </div>
  );
}
