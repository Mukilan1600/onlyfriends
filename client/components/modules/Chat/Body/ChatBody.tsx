import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../../providers/WebSocketProvider";

import useChat, { IMessage } from "../../../stores/useChat";
import useLoader from "../../../stores/useLoader";
import useLoadMessages from "../../../stores/useLoadMessages";
import useProfile from "../../../stores/useProfile";
import Spinner from "../../Spinner/Spinner";
import Message from "./Message";

const ChatBodyDiv = styled.div`
  height: 100%;
  width: 100%;
  flex: 1 1 0;
  background: #f3f3f3;
  padding: 35px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
  z-index: 1;
`;

const SpinnerWrapper = styled.div`
  z-index: 10;
  position: absolute;
  left: 10px;
  top: 90px;
`;

const ChatBody: React.FC = () => {
  const { messages } = useChat();
  const chatBodyRef = useRef<HTMLDivElement>();
  const { loadMoreMessages } = useLoadMessages();
  const { messagesLoading } = useLoader();
  const { socket } = useContext(WebSocketContext);
  const { user } = useProfile();

  const sendMessageAcknowledgements = (newMessages: IMessage[]) => {
    const { chat } = useChat.getState();
    const unAcknowledgedMessages = newMessages.filter((message) => !message.readBy.includes(user._id));
    if (unAcknowledgedMessages.length > 0)
      socket.emit(
        "acknowledge_messages",
        chat._id,
        unAcknowledgedMessages.map((msg) => msg._id)
      );
  };

  const handlePageVisibilityChange = () => {
    const { unacknowledgedMessages, setUnacknowledgedMessages } = useChat.getState();
    if (!document.hidden && unacknowledgedMessages.length > 0) {
      sendMessageAcknowledgements(unacknowledgedMessages);
      setUnacknowledgedMessages([]);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handlePageVisibilityChange, false);
    return () => {
      document.removeEventListener("visibilitychange", handlePageVisibilityChange, false);
    };
  }, []);

  const onChatScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event.currentTarget.scrollHeight + event.currentTarget.scrollTop <= event.currentTarget.clientHeight + 3 && !messagesLoading) {
      loadMoreMessages();
    }
  };

  return (
    <>
      {messagesLoading && (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
      <ChatBodyDiv ref={chatBodyRef} onScroll={onChatScroll}>
        {messages.map((msg, i) => (
          <Message message={msg} key={i} idx={i} />
        ))}
      </ChatBodyDiv>
    </>
  );
};

export default ChatBody;
