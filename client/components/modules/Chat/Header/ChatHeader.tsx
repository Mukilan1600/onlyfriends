import React from "react";
import styled from "styled-components";
import AudioCallIcon from "../../../statics/icons/AudioCallIcon";
import useCall from "../../../stores/useCall";
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
  svg {
    cursor: pointer;
  }
`;

export default function ChatHeader() {
  const { chat } = useChat();
  const { makeCall } = useCall();
  return (
    <HeaderDiv>
      <DetailsDiv>
        <img
          src={chat.participants[0].user.avatarUrl}
          alt="friend"
          height="38"
          width="38"
          style={{ borderRadius: "50%" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p>{chat.participants[0].user.name}</p>
          <StatusIndicator />
        </div>
      </DetailsDiv>
      <ActionsDiv>
        <div
          onClick={makeCall.bind(
            this,
            chat.participants[0].user.oauthId,
            false
          )}
        >
          <AudioCallIcon />
        </div>
      </ActionsDiv>
    </HeaderDiv>
  );
}
