import React from "react";
import FriendsList from "../FriendsList/FriendsList";
import Navbar from "../Navbar";
import AuthenticatedPage from "./AuthenticatedPage";
import Layout from "./Layout";

const NavbarAndFriendsList: React.FC = ({ children }) => {
  return (
    <AuthenticatedPage>
      <Navbar />
      <Layout>
        <FriendsList />
        {children}
      </Layout>
    </AuthenticatedPage>
  );
};

export default NavbarAndFriendsList;
