import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../../providers/WebSocketProvider";

const ChatInputDiv = styled.div`
  min-height: 67px;
  width: 100%;
  padding: 17px 50px;
`;

const MessageContainer = styled.div`
  border: 0.2px solid #000000;
  background: #f9f9f9;
  padding: 9px 12px 11px;
  border-radius: 12px;
  position: relative;
`;

const MessageInput = styled.div`
  width: 100%;
  min-height: 18px;
  max-height: 200px;
  overflow-y: auto;
  box-sizing: border-box;
  outline: none;
  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
`;

interface MessagePlaceholderProps {
  readonly visible: boolean;
}

const MessagePlaceholder = styled.div<MessagePlaceholderProps>`
  position: absolute;
  top: 12px;
  font-size: 14px;
  left: 14px;
  visibility: ${(props) => (props.visible ? "hidden" : "visible")};
  user-select: none;
  pointer-events: none;
  color: #888;
`;

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLDivElement>();
  const { socket } = useContext(WebSocketContext)

  const onMessage = () => {
    setMessage(inputRef.current.innerHTML);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setMessage((message) => {
        if (message.length > 0) console.log(message);
        return "";
      });
      inputRef.current.innerHTML = "";
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.addEventListener("keydown", onKeyDown);
    inputRef.current.addEventListener("input", onMessage);
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("input", () => {});
        inputRef.current.removeEventListener("keydown", () => {});
      }
    };
  }, [inputRef.current]);

  return (
    <ChatInputDiv>
      <MessageContainer>
        <MessagePlaceholder visible={message.length > 0}>
          Type your message here
        </MessagePlaceholder>
        <MessageInput contentEditable ref={inputRef} />
      </MessageContainer>
    </ChatInputDiv>
  );
};

export default ChatInput;
