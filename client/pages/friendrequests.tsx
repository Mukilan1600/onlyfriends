import React from "react";
import FriendRequests from "../components/modules/FriendRequests/FriendRequests";
import NavbarAndFriendsList from "../components/modules/Wrappers/NavbarAndFriendsList";

const friendrequests: React.FC = () => {
  return (
    <NavbarAndFriendsList>
      <FriendRequests />
    </NavbarAndFriendsList>
  );
};
export default friendrequests;
