import React from "react";
import styled from "styled-components";
import useChat from "../../../../stores/useChat";
import useMessage from "../../../../stores/useMessage";
import useProfile from "../../../../stores/useProfile";
import { formatMessage } from "../../Body/utils";

const ReplyPreviewWrapper = styled.div`
  max-height: 92px;
  display: flex;
  flex-direction: column;
  padding: 5px 40px;
  background: #f3f3f3;
  padding: 10px 100px;
  user-select: none;
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

const PreviewDiv = styled.div`
  border-left: 5px solid #525252;
  padding-left: 12px;
  overflow: hidden;
  width: fit-content;
`;

const ReplyPreview: React.FC = () => {
  const { user } = useProfile();
  const { chat } = useChat();
  const { replyTo, setReplyTo } = useMessage();
  const sentByMe = replyTo && user._id === replyTo.sentBy;
  return (
    replyTo && (
      <ReplyPreviewWrapper>
        <PreviewDiv>
          <PreviewHeader>
            <div>{sentByMe ? "You" : chat.participants[0].user.name}</div>
            <div style={{ cursor: "pointer" }} onClick={() => setReplyTo(null)}>
              x
            </div>
          </PreviewHeader>
          <MessagePreview>{replyTo.message.map(formatMessage)}</MessagePreview>
        </PreviewDiv>
      </ReplyPreviewWrapper>
    )
  );
};

export default ReplyPreview;
