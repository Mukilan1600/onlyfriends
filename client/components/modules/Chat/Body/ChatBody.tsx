import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../../providers/WebSocketProvider";
import useChat, { IMessage } from "../../../stores/useChat";
import Message from "./Message";

const ChatBodyDiv = styled.div`
  height: 100%;
  width: 100%;
  flex: 1 1 0;
  position: relative;
  background: #f3f3f3;
  padding: 35px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column-reverse;
`;

const ChatBody: React.FC = () => {
  const { socket } = useContext(WebSocketContext);
  const { offset, messages, chat, resetChat } = useChat();
  const chatBodyRef = useRef<HTMLDivElement>();

  const getMessages = () => {
    socket.emit("get_messages", chat._id, offset);
  };

  useEffect(() => {
    if (!chatBodyRef.current) return;
    getMessages();
    socket.on("messages", (newMessages: IMessage[]) => {
      const { setMessages, messages } = useChat.getState();
      newMessages.reverse();
      messages.unshift(...newMessages);
      setMessages(messages);
    });

    /** @Mukilan1600 update unread messages  */
    socket.on("receive_message", (chatId: string, msg: IMessage) => {
      if (chatId === chat._id) {
        const { setMessages, messages } = useChat.getState();
        messages.unshift(msg);
        setMessages(messages);
      }
    });
    return () => {
      socket.off("messages");
      socket.off("receive_message");
      resetChat();
    };
  }, []);

  return (
    <ChatBodyDiv ref={chatBodyRef}>
      {messages.map((msg, i) => (
        <Message message={msg} key={i} idx={i} />
      ))}
    </ChatBodyDiv>
  );
};

export default ChatBody;
