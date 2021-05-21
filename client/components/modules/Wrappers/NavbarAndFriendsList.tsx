import React from "react";
import styled from "styled-components";
import CallPreview from "../Call/CallPreview";
import ChatsList from "../ChatList/ChatList";
import Navbar from "../Navbar";
import AuthenticatedPage from "./AuthenticatedPage";
import Layout from "./Layout";

const LeftPane = styled.div`
  height: calc(100vh - 70px);
  width: 380px;
  min-width: 380px;
  display: flex;
  flex-direction: column;
`;

const NavbarAndFriendsList: React.FC = ({ children }) => {
  return (
    <AuthenticatedPage>
      <Navbar />
      <Layout>
        <LeftPane>
          <CallPreview />
          <ChatsList />
        </LeftPane>
        {children}
      </Layout>
    </AuthenticatedPage>
  );
};

export default NavbarAndFriendsList;
