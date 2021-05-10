import React, { useRef } from "react";
import styled from "styled-components";

import useChat from "../../../stores/useChat";
import useLoader from "../../../stores/useLoader";
import useLoadMessages from "../../../stores/useLoadMessages";
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

  const onChatScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (
      event.currentTarget.scrollHeight + event.currentTarget.scrollTop ===
        event.currentTarget.clientHeight &&
      !messagesLoading
    ) {
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
