import React, { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import EditIcon from "../statics/icons/EditIcon";
import useProfile from "../stores/useProfile";
import styles from "./NavbarProfileModal.module.css";

export default function NavbarProfileModal() {
  const { socket } = useContext(WebSocketContext);
  const { user } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const usernameRef = useRef<HTMLParagraphElement>();

  useEffect(() => {
    usernameRef.current.innerText = user.username;
  }, [usernameRef.current, user.username]);

  const toggleEditing = () => {
    setIsEditing((isEditing) => !isEditing);
  };

  const onUsernameSave = (event: React.FocusEvent<HTMLParagraphElement>) => {
    if (
      event.target.innerText.length > 0 &&
      user.username !== event.target.innerText
    )
      socket.emit("change_username", { username: event.target.innerText });
    usernameRef.current.innerText = user.username;
    toggleEditing();
  };

  return (
    <div className={styles.profileModalDiv}>
      <img src={user.avatarUrl} alt="User" id={styles.profileModalImg} />
      <div id={styles.profileModalUsernameDiv}>
        <p
          id={styles.profileModalUsername}
          contentEditable={isEditing}
          spellCheck="false"
          onBlur={onUsernameSave}
          ref={usernameRef}
        ></p>
        <div onClick={toggleEditing} className={styles.usernameEditIcon}>
          <EditIcon />
        </div>
      </div>
      <div className={styles.divider} />
    </div>
  );
}
