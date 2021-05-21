import React, { useContext } from "react";
import styled from "styled-components";
import { PeerCallContext } from "../../../providers/PeerCallWrapper";
import AudioCallIcon from "../../../statics/icons/AudioCallIcon";
import VideoCallIcon from "../../../statics/icons/VideoCallIcon";
import useChat from "../../../stores/useChat";
import StatusIndicator from "./StatusIndicator/StatusIndicator";

const HeaderDiv = styled.div`
  display: flex;
  height: 77px;
  width: 100%;
  background: #ffffff;
  padding: 20px 40px;
  align-items: center;
  justify-content: space-between;
`;

const DetailsDiv = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: nowrap;

  p {
    margin: 0;
    margin-left: 26px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: Raleway;
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
  }
`;

const ActionsDiv = styled.div`
  display: flex;
`;

const CallButton = styled.div<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  margin-left: 21px;
  svg path {
    fill: ${({ disabled }) => (disabled ? "#525252" : "#000")};
  }
`;
export default function ChatHeader() {
  const { chat } = useChat();
  const { makeCall } = useContext(PeerCallContext);
  return (
    <HeaderDiv>
      <DetailsDiv>
        <img src={chat.participants[0].user.avatarUrl} alt="friend" height="38" width="38" style={{ borderRadius: "50%" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>{chat.participants[0].user.name}</p>
          <StatusIndicator />
        </div>
      </DetailsDiv>
      <ActionsDiv>
        <CallButton
          onClick={chat.participants[0].user.online ? makeCall.bind(this, chat.participants[0].user.oauthId, false) : null}
          disabled={!chat.participants[0].user.online}
        >
          <AudioCallIcon />
        </CallButton>
        <CallButton
          onClick={chat.participants[0].user.online ? makeCall.bind(this, chat.participants[0].user.oauthId, true) : null}
          disabled={!chat.participants[0].user.online}
        >
          <VideoCallIcon />
        </CallButton>
      </ActionsDiv>
    </HeaderDiv>
  );
}
