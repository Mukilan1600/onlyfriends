import React, { useContext, useState } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import Button from "../Button";
import styles from "./AddNewFriends.module.css";

/**
 * @Mukilan1600 Change to use username
 *              add new friends
 */
const AddNewFriends: React.FC = () => {
  const { socket } = useContext(WebSocketContext);
  const [username, setUsername] = useState("");

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onAddFriend = () => {
    if (username.length === 0) return;
    socket.emit("add_friend", { username });
  };
  return (
    <div className={styles.body}>
      <h4 className={styles.header}>Add new friend</h4>
      <div className={styles.inputDiv}>
        <input
          type="text"
          name="userId"
          placeholder="Enter username to add new friends"
          onChange={onUsernameChange}
        />
        <Button onClick={onAddFriend} label="Add friend" />
      </div>
    </div>
  );
};

export default AddNewFriends;
