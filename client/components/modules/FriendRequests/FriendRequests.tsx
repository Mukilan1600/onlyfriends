import React from "react";
import AddNewFriends from "./AddNewFriends";
import RequestsTabs from "./RequestsTabs";

const FriendRequests: React.FC = () => {
  return (
    <div>
      <AddNewFriends />
      <RequestsTabs />
    </div>
  );
};

export default FriendRequests;
