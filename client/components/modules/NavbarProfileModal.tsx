import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import EditIcon from "../statics/icons/EditIcon";
import useProfile from "../stores/useProfile";
import useToken from "../stores/useToken";
import Button from "./Button";
import styles from "./NavbarProfileModal.module.css";

export default function NavbarProfileModal() {
  const { socket } = useContext(WebSocketContext);
  const { user } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
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

  const onLogout = () => {
    useToken.getState().clearTokens();
    router.push(`${process.env.NEXT_PUBLIC_SERVER}/api/auth/logout`);
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
        <Button
          style={{
            height: "38px",
            padding: "10px 30px",
            width: "120px",
            marginTop: "38px",
          }}
          label="Sign out"
          onClick={onLogout}
        />
    </div>
  );
}
