import React from "react";
import styled from "styled-components";
import ReadTickIcon from "../../../statics/icons/ReadTickIcon";
import ReplyIcon from "../../../statics/icons/ReplyIcon";
import useChat, { IMessage } from "../../../stores/useChat";
import useMessage from "../../../stores/useMessage";
import useProfile from "../../../stores/useProfile";
import ReplyMessage from "./ReplyMessage";
import { saveAs } from "file-saver";
import { formatFileMessage, formatMessage } from "./utils";

interface MessageProps {
  readonly sentByMe: boolean;
}

interface ReadReceiptProps {
  readonly allRead: boolean;
}

const ReadReceipt = styled.div<ReadReceiptProps>`
  svg {
    display: block;
    fill: ${({ allRead }) => (allRead ? "#34B7F1" : "#626262")};
  }
  margin: -12px 0px -5px 4px;
  width: 11px;
  height: 11px;
`;

const ReplyButton = styled.div<MessageProps>`
  display: none;
  cursor: pointer;
  position: absolute;
  top: 0px;
  left: ${({ sentByMe }) => (sentByMe ? "-25px" : "unset")};
  right: ${({ sentByMe }) => (!sentByMe ? "-25px" : "unset")};
  transform: translate(0%, 25%);
`;

const MessageWrapper = styled.div<MessageProps>`
  width: 100%;
  display: flex;
  justify-content: ${({ sentByMe }) => (sentByMe ? "flex-end" : "flex-start")};
  align-items: center;
  &:hover ${ReplyButton} {
    display: block;
  }
`;

const MessageDiv = styled.div<MessageProps>`
  display: flex;
  flex-direction: column;
  white-space: pre-wrap;
  word-wrap: break-word;
  box-shadow: 0px 0px 4px -0.5px rgba(0, 0, 0, 0.5);
  border-radius: 11px;
  padding: 5px 10px;
  margin: 1px 0px;
  background: ${({ sentByMe }) => (sentByMe ? "#ffffff" : "#55A3FF")};
  color: ${({ sentByMe }) => (sentByMe ? "#000" : "#FFF")};

  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 14.2px;
  line-height: 20px;

  a {
    color: ${({ sentByMe }) => (sentByMe ? "#68bbe4" : "#0000B8")};
  }

  .emoji-mart-emoji {
    vertical-align: top;
    font-size: unset;
  }
`;

const TimeDiv = styled.div<MessageProps>`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  span {
    float: right;
    margin: -12px 0px -5px 4px;
    font-family: Raleway;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: ${({ sentByMe }) =>
      sentByMe ? "rgba(82, 82, 82, 0.80)" : "rgba(255, 255, 255, 0.59)"};
  }
`;

interface IMessageProps {
  message: IMessage;
  idx: number;
}

const Message: React.FC<IMessageProps> = ({ message, idx }) => {
  const { chat } = useChat();
  const { user } = useProfile();
  const { setReplyTo } = useMessage();
  const sentByMe = message.sentBy === user._id;
  const date = new Date(message.createdAt);

  const isToday = () => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getFormattedTime = () => {
    if (isToday())
      return date.toLocaleTimeString(undefined, {
        hour12: false,
        minute: "2-digit",
        hour: "2-digit",
      });
    else return date.toLocaleDateString();
  };

  const replyToMessage = (message: IMessage) => {
    setReplyTo(message);
  };

  return (
    <MessageWrapper sentByMe={sentByMe} id={`message-${idx}`}>
      <ReplyMessage message={message} chat={chat} user={user}>
        <div style={{ position: "relative" }}>
          {sentByMe && (
            <ReplyButton
              onClick={replyToMessage.bind(this, message)}
              sentByMe={sentByMe}
            >
              <ReplyIcon />
            </ReplyButton>
          )}
          <MessageDiv sentByMe={sentByMe}>
            <div>
              {message.type === "file" ? (
                formatFileMessage(message)
              ) : (
                <span>{message.message.map(formatMessage)}</span>
              )}
              <span
                style={{
                  width: isToday() ? "46px" : "72px",
                  display: "inline-block",
                }}
              ></span>
            </div>
            <TimeDiv sentByMe={sentByMe}>
              <span title={date.toLocaleString()}>{getFormattedTime()}</span>
              {sentByMe && (
                <ReadReceipt
                  allRead={message.readBy.length > chat.participants.length}
                  title={
                    message.readBy.length > chat.participants.length
                      ? "Read"
                      : "Delivered"
                  }
                >
                  <ReadTickIcon />
                </ReadReceipt>
              )}
            </TimeDiv>
          </MessageDiv>
          {!sentByMe && (
            <ReplyButton
              onClick={replyToMessage.bind(this, message)}
              sentByMe={sentByMe}
            >
              <ReplyIcon />
            </ReplyButton>
          )}
        </div>
      </ReplyMessage>
    </MessageWrapper>
  );
};

export default Message;
