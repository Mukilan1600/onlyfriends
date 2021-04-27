import React from "react";
import styled from "styled-components";
import EditIcon from "../../../statics/icons/EditIcon";
import ReplyIcon from "../../../statics/icons/ReplyIcon";
import { IMessage } from "../../../stores/useChat";
import useMessage from "../../../stores/useMessage";
import useProfile from "../../../stores/useProfile";

interface MessageProps {
  readonly sentByMe: boolean;
}

const ReplyButton = styled.div`
  display: none;
  cursor: pointer;
  margin: 5px;
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
  width: fit-content;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 50%;
  min-height: 25px;
  box-shadow: 0px 0px 14px -6px rgba(0, 0, 0, 0.5);
  border-radius: 11px;
  padding: 5px 10px;
  margin: 2px 0px;
  background: ${({ sentByMe }) => (sentByMe ? "#55A3FF" : "#ffffff")};
  color: ${({ sentByMe }) => (sentByMe ? "#FFF" : "#000")};

  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 14.2px;
  line-height: 21px;
`;

const TimeDiv = styled.div<MessageProps>`
  width: 100%;
  span {
    float: right;
    margin: -12px 0px -5px 4px;
    font-family: Raleway;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: ${({ sentByMe }) =>
      sentByMe ? "rgba(255, 255, 255, 0.59)" : "rgba(82, 82, 82, 0.80)"};
  }
`;

interface IMessageProps {
  message: IMessage;
  idx: number;
}

const Message: React.FC<IMessageProps> = ({ message, idx }) => {
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

  return (
    <MessageWrapper sentByMe={sentByMe} id={`message-${idx}`}>
      {sentByMe && (
        <ReplyButton onClick={setReplyTo.bind(this, message)}>
          <ReplyIcon />
        </ReplyButton>
      )}
      <MessageDiv sentByMe={sentByMe}>
        <div>
          <span>{message.message}</span>
          <span style={{ width: "36px", display: "inline-block" }}></span>
        </div>
        <TimeDiv sentByMe={sentByMe}>
          <span title={date.toLocaleString()}>{getFormattedTime()}</span>
        </TimeDiv>
      </MessageDiv>
      {!sentByMe && (
        <ReplyButton onClick={setReplyTo.bind(this, message)}>
          <ReplyIcon />
        </ReplyButton>
      )}
    </MessageWrapper>
  );
};

export default Message;
