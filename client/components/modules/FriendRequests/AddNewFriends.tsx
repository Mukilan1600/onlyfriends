import React, { useContext, useState } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useLoader from "../../stores/useLoader";
import Button from "../Button";
import styles from "./AddNewFriends.module.css";

const AddNewFriends: React.FC = () => {
  const { socket } = useContext(WebSocketContext);
  const [username, setUsername] = useState("");
  const { friendRequest, setLoader } = useLoader();

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onAddFriend = () => {
    if (username.length === 0) return;
    setLoader({ friendRequest: true });
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
        <Button
          onClick={onAddFriend}
          label="Add friend"
          loading={friendRequest}
        />
      </div>
    </div>
  );
};

export default AddNewFriends;
