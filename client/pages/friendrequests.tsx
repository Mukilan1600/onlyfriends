import React from "react";
import NavbarAndFriendsList from "../components/modules/Wrappers/NavbarAndFriendsList";

const friendrequests = () => {
  return <NavbarAndFriendsList>Friend requests</NavbarAndFriendsList>;
};

friendrequests.ws = true;

export default friendrequests;
