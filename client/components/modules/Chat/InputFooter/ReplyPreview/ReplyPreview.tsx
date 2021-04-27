import React from "react";
import styled from "styled-components";
import useChat, { IMessage } from "../../../../stores/useChat";
import useMessage from "../../../../stores/useMessage";
import useProfile from "../../../../stores/useProfile";

const ReplyPreviewWrapper = styled.div`
  max-height: 84px;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 5px 40px;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
`;

const MessagePreview = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 3px;
  padding: 3px 9px;
  font-size: 12px;
  line-height: 16px;
  font-family: Raleway;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ReplyPreview: React.FC = () => {
  const { user } = useProfile();
  const { chat } = useChat();
  const { replyTo, setReplyTo } = useMessage();
  const sentByMe = replyTo && user._id === replyTo.sentBy;
  return (
    replyTo && (
      <ReplyPreviewWrapper>
        <PreviewHeader>
          <div>{sentByMe ? "You" : chat.participants[0].name}</div>
          <div style={{ cursor: "pointer" }} onClick={() => setReplyTo(null)}>
            x
          </div>
        </PreviewHeader>
        <MessagePreview>{replyTo.message}</MessagePreview>
      </ReplyPreviewWrapper>
    )
  );
};

export default ReplyPreview;
