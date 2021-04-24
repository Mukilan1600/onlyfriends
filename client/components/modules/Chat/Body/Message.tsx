import React from "react";
import styled from "styled-components";
import { IMessage } from "../../../stores/useChat";
import useProfile from "../../../stores/useProfile";

interface MessageProps {
  readonly sentByMe: boolean;
}

const MessageWrapper = styled.div<MessageProps>`
  width: 100%;
  display: flex;
  justify-content: ${({sentByMe}) => sentByMe?"flex-end":"flex-start"};
`;

const MessageDiv = styled.div<MessageProps>`
  width: fit-content;
  white-space: pre-wrap;
  max-width: 50%;
  min-height: 25px;
  box-shadow: 0px 0px 14px -6px rgba(0, 0, 0, 0.5);
  border-radius: 11px;
  padding: 5px 10px;
  margin: 10px 0px;
  background: ${({ sentByMe }) => (sentByMe ? "#55A3FF" : "#ffffff")};
  color: ${({ sentByMe }) => (sentByMe ? "#FFF" : "#000")};

  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 21px;
`;

interface IMessageProps {
  message: IMessage;
}

const Message: React.FC<IMessageProps> = ({ message }) => {
  const { user } = useProfile();
  const sentByMe = message.sentBy === user._id;
  return (
    <MessageWrapper sentByMe={sentByMe}>
      <MessageDiv sentByMe={sentByMe}>{message.message}</MessageDiv>
    </MessageWrapper>
  );
};

export default Message;
