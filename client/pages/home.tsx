import React from "react";
import NavbarAndFriendsList from "../components/modules/Wrappers/NavbarAndFriendsList";
import { PageComponenet } from "../types";

const Home: PageComponenet = () => {
  return (
    <NavbarAndFriendsList>
      <div>Main</div>
    </NavbarAndFriendsList>
  );
};
Home.noRedirect = true;
export default Home;
