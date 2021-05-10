import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../../providers/WebSocketProvider";
import useChat, { IMessage, IMessageFragment } from "../../../stores/useChat";
import { BaseEmoji, emojiIndex } from "emoji-mart";
import Emoji from "./EmojiPalette/Emoji";
import useMessage from "../../../stores/useMessage";
import { isAnEmoji } from "../Body/utils";
import { isLink } from "./utils";
import UploadInput from "./FileUpload/UploadInput";
import useFileUpload from "../../../stores/useFileUpload";
import FileUploadDialog from "./FileUpload/FileUploadDialog";

const ChatInputDiv = styled.div`
  height: 77px;
  width: 100%;
  padding: 17px 50px;
  display: flex;
  position: relative;
  align-items: center;
  z-index: 10;
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
  let timeout: NodeJS.Timeout;
  const [typing, setTyping] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLDivElement>();
  const { socket } = useContext(WebSocketContext);
  const { chat } = useChat();
  const { replyTo } = useMessage();
  const { file } = useFileUpload();

  const onMessage = () => {
    resetTimer();
    setTyping(true);
    setMessage(inputRef.current.innerHTML);
  };

  const onEmojiSelect = (emoji: BaseEmoji) => {
    const newMessage = insertAtCursor(message, emoji.colons);
    setMessage(newMessage);
    inputRef.current.innerHTML = newMessage;
  };

  const insertAtCursor = (message: string, value: string): string => {
    if (window.getSelection) {
      var sel = document.getSelection();
      var range: Range;
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (sel.anchorNode.parentElement === inputRef.current) {
          message =
            message.substr(0, range.startOffset) +
            value +
            message.substr(range.endOffset, message.length - range.endOffset);
        } else {
          message += value;
        }
      } else {
        message += value;
      }
    } else {
      message += value;
    }

    return message;
  };

  const sendMessage = (message: string) => {
    let messageArray: IMessageFragment[] = [];

    const itemsArray: IMessageFragment[] = [];
    const itemFragments = message.trim().split(" ");

    itemFragments.forEach((item, index) => {
      var messageType: "text" | "link" = "text";
      if (isLink(item)) {
        messageType = "link";
      }
      if (item.length > 0 || index > 0)
        itemsArray.push({
          type: messageType,
          msg: (index > 0 ? " " : "") + item,
        });
    });

    itemsArray.forEach((fragment) => {
      if (fragment.type === "text") {
        let prevEmote = false;
        const messageFragments = fragment.msg.split(":");
        messageFragments.forEach((messageFrag, i) => {
          const emoji = emojiIndex.search(messageFrag);
          if (
            !prevEmote &&
            i > 0 &&
            i < messageFragments.length - 1 &&
            ((emoji && emoji.length > 0 && emoji[0].id === messageFrag) ||
              isAnEmoji(messageFrag))
          ) {
            prevEmote = true;
            messageArray.push({ type: "emote", id: messageFrag });
          } else {
            if (messageFrag.length > 0)
              messageArray.push({
                type: "text",
                msg: (!prevEmote && i > 0 ? ":" : "") + messageFrag,
              });
            prevEmote = false;
          }
        });
      } else messageArray.push(fragment);
    });

    if (messageArray.length === 0) return;

    const newMessage: IMessage = { type: "message", message: messageArray };
    const { replyTo, setReplyTo } = useMessage.getState();
    if (replyTo) {
      newMessage.reply = true;
      newMessage.replyTo = replyTo;
      setReplyTo(null);
    }
    socket.emit("send_message", chat._id, newMessage);
    setTyping(false);
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

  useEffect(() => {
    if (replyTo !== null) inputRef.current.focus();
  }, [replyTo]);

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(setTyping.bind(this, false), 3000);
  };

  useEffect(() => {
    socket.emit("is_typing", chat._id, typing);

    return () => {
      if (timeout !== undefined) clearTimeout(timeout);
    };
  }, [typing]);

  return (
    <ChatInputDiv>
      {file ? (
        <FileUploadDialog />
      ) : (
        <>
          <UploadInput />
          <Emoji onEmojiSelect={onEmojiSelect} />
          <MessageContainer>
            <MessagePlaceholder visible={message.length > 0}>
              Type your message here
            </MessagePlaceholder>
            <MessageInput
              contentEditable
              ref={inputRef}
              onBlur={setTyping.bind(this, false)}
            />
          </MessageContainer>
        </>
      )}
    </ChatInputDiv>
  );
};

export default ChatInput;
