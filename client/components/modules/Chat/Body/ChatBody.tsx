import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../../providers/WebSocketProvider";
import useChat, { IMessage } from "../../../stores/useChat";

const ChatBodyDiv = styled.div`
  height: 100%;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  background: #F3F3F3;
`;

const ChatBody: React.FC = () => {
  const { socket } = useContext(WebSocketContext);
  const { offset, messages, chat, resetChat } = useChat();

  const getMessages = () => {
    socket.emit("get_messages", chat._id, offset);
  };

  useEffect(() => {
    getMessages();
    socket.on("messages", (newMessages: IMessage[]) => {
      const { setMessages, messages } = useChat.getState();
      messages.push(...newMessages);
      setMessages(messages);
    });

    return () => {
      socket.off("messages");
      resetChat();
    };
  }, []);

  return <ChatBodyDiv>{messages}</ChatBodyDiv>;
};

export default ChatBody;
