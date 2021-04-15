import React from "react";
import FriendRequests from "../components/modules/FriendRequests/FriendRequests";
import NavbarAndFriendsList from "../components/modules/Wrappers/NavbarAndFriendsList";
import { PageComponenet } from "../types";

const friendrequests: PageComponenet = () => {
  return (
    <NavbarAndFriendsList>
      <FriendRequests />
    </NavbarAndFriendsList>
  );
};
friendrequests.noRedirect = true;
export default friendrequests;
