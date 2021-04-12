import React, { useContext, useState } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
/**
 * @Mukilan1600 Change to use username
 *              add new friends
 */
const AddNewFriends: React.FC = () => {
    const {socket} = useContext(WebSocketContext)
  const [userId, setUserId] = useState("");

  const onUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const onAddFriend = () => {
      if(userId.length===0) return;
        socket.emit("add_friend", {userId})
  };
  return (
    <div>
      Add new friend
      <div>
        <input
          type="text"
          name="userId"
          placeholder="Enter userID to add new friends"
          onChange={onUserIdChange}
        />
        <button onClick={onAddFriend}>Add</button>
      </div>
    </div>
  );
};

export default AddNewFriends;
