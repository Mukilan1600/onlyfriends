import React from "react";
import styled from "styled-components";
import useChat, { IMessage } from "../../../stores/useChat";
import useProfile, { IUser } from "../../../stores/useProfile";
import { IChat } from "../../ChatList/ChatListItem";
import { formatMessage } from "./utils";

interface IReplyMessageProps {
  message: IMessage;
  chat: IChat;
  user: IUser;
}

const ReplyMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 65%;
  min-height: 25px;
  width: fit-content;
  margin: 2px 0px;
`;

const PreviewDiv = styled.div`
  user-select: none;
  border-left: 5px solid #525252;
  padding-left: 12px;
  overflow: hidden;
  max-height: 90px;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Raleway;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;

  color: #525252;
`;

const MessagePreview = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px;
  padding: 3px 9px;
  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 16px;

  color: #525252;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ReplyMessage: React.FC<IReplyMessageProps> = ({
  message,
  chat,
  user,
  children,
}) => {
  const replyTo = message.replyTo as IMessage;
  const sentByMe = message.reply ? replyTo.sentBy === user._id : false;
  return (
    <ReplyMessageWrapper>
      {message.reply && (
        <PreviewDiv>
          <PreviewHeader>
            <div>{sentByMe ? "You" : chat.participants[0].user.name}</div>
          </PreviewHeader>
          <MessagePreview>{replyTo.message.map(formatMessage)}</MessagePreview>
        </PreviewDiv>
      )}
      {children}
    </ReplyMessageWrapper>
  );
};

export default ReplyMessage;
