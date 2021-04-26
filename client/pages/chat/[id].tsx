import React from "react";
import NavbarAndFriendsList from "../../components/modules/Wrappers/NavbarAndFriendsList";
import CheckValidChat from "../../components/modules/Wrappers/CheckValidChat";
import ChatLayout from "../../components/modules/Chat/ChatLayout";
import ChatHeader from "../../components/modules/Chat/Header/ChatHeader";
import ChatBody from "../../components/modules/Chat/Body/ChatBody";
import ChatInput from "../../components/modules/Chat/InputFooter/ChatInput";
import ReplyPreview from "../../components/modules/Chat/InputFooter/ReplyPreview/ReplyPreview";

const Chat: React.FC = () => {
  return (
    <NavbarAndFriendsList>
      <CheckValidChat>
        <ChatLayout>
          <ChatHeader />
          <ChatBody />
          <ReplyPreview />
          <ChatInput />
        </ChatLayout>
      </CheckValidChat>
    </NavbarAndFriendsList>
  );
};

export default Chat;
