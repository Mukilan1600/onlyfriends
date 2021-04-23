import React from "react";
import NavbarAndFriendsList from "../../components/modules/Wrappers/NavbarAndFriendsList";
import CheckValidChat from "../../components/modules/Wrappers/CheckValidChat";
import ChatLayout from "../../components/modules/Chat/ChatLayout";
import ChatHeader from "../../components/modules/Chat/Header/ChatHeader";

const Chat: React.FC = () => {
  return (
    <NavbarAndFriendsList>
      <CheckValidChat>
        <ChatLayout>
          <ChatHeader />
          <div>body</div>
          <div>input</div>
        </ChatLayout>
      </CheckValidChat>
    </NavbarAndFriendsList>
  );
};

export default Chat;
