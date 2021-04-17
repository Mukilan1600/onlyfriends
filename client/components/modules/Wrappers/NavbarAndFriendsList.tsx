import React from "react";
import ChatsList from "../ChatList/ChatList";
import Navbar from "../Navbar";
import AuthenticatedPage from "./AuthenticatedPage";
import Layout from "./Layout";

const NavbarAndFriendsList: React.FC = ({ children }) => {
  return (
    <AuthenticatedPage>
      <Navbar />
      <Layout>
        <ChatsList />
        {children}
      </Layout>
    </AuthenticatedPage>
  );
};

export default NavbarAndFriendsList;
