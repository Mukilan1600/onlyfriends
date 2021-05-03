import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../../providers/WebSocketProvider";
import useChat, { IMessage, IMessageFragment } from "../../../stores/useChat";
import { BaseEmoji, emojiIndex } from "emoji-mart";
import Emoji from "./EmojiPalette/Emoji";
import useMessage from "../../../stores/useMessage";
import { isAnEmoji } from "../Body/utils";

const ChatInputDiv = styled.div`
  min-height: 67px;
  width: 100%;
  padding: 17px 50px;
  display: flex;
  position: relative;
  align-items: center;
`;

const MessageContainer = styled.div`
  border: 0.2px solid #000000;
  background: #f9f9f9;
  padding: 9px 12px 11px;
  border-radius: 12px;
  position: relative;
  width: 100%;
  margin-left: 26px;
`;

const MessageInput = styled.div`
  width: 100%;
  word-break: break-word;
  white-space: pre-wrap;
  max-height: 200px;
  min-height: 18px;
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
  const { socket } = useContext(WebSocketContext);
  const { chat } = useChat();

  const onMessage = () => {
    setMessage(inputRef.current.innerHTML);
  };

  const onEmojiSelect = (emoji: BaseEmoji) => {
    const newMessage = message + emoji.colons;
    setMessage(newMessage);
    inputRef.current.innerHTML = newMessage;
  };

  const sendMessage = (message: string) => {
    const messageArray: IMessageFragment[] = [];
    const messageFragments = message.split(":");
    messageFragments.forEach((messageFrag, i) => {
      const emoji = emojiIndex.search(messageFrag);
      if (
        i > 0 &&
        i < messageFragments.length - 1 &&
        ((emoji && emoji.length > 0 && emoji[0].id === messageFrag) ||
          isAnEmoji(messageFrag))
      )
        messageArray.push({ type: "emote", id: messageFrag });
      else if (messageFrag.trim().length > 0)
        messageArray.push({ type: "text", msg: messageFrag.trim() });
    });
    const newMessage: IMessage = { type: "message", message: messageArray };
    const { replyTo, setReplyTo } = useMessage.getState();
    if (replyTo) {
      newMessage.reply = true;
      newMessage.replyTo = replyTo;
      setReplyTo(null);
    }
    socket.emit("send_message", chat._id, newMessage);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setMessage((message) => {
        if (message.length > 0) {
          sendMessage(message);
        }
        return "";
      });
      inputRef.current.innerHTML = "";
    }
  };

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    var text = e.clipboardData.getData("text/plain").trim();
    document.execCommand("insertHTML", false, text);
  };

  const removeListeners = () => {
    if (inputRef.current) {
      inputRef.current.removeEventListener("input", onMessage);
      inputRef.current.removeEventListener("keydown", onKeyDown);
      inputRef.current.removeEventListener("paste", onPaste);
    }
  };

  useEffect(() => {
    if (!inputRef.current) return;

    removeListeners();

    inputRef.current.addEventListener("keydown", onKeyDown);
    inputRef.current.addEventListener("input", onMessage);
    inputRef.current.addEventListener("paste", onPaste);
    return () => {
      removeListeners();
    };
  }, [inputRef.current]);

  return (
    <ChatInputDiv>
      <Emoji onEmojiSelect={onEmojiSelect} />
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
