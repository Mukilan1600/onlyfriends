import React from "react";
import styled from "styled-components";
import useChat from "../../../stores/useChat";

const HeaderDiv = styled.div`
  display: flex;
  height: 77px;
  width: 100%;
  box-shadow: 0px 0px 86px -30px rgba(0, 0, 0, 0.25);
  background: #ffffff;
  padding: 20px 25px;
  align-items: center;
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

export default function ChatHeader() {
  const { chat } = useChat();
  return (
    <HeaderDiv>
      <DetailsDiv>
        <img
          src={chat.participants[0].avatarUrl}
          alt="friend"
          height="38"
          width="38"
          style={{ borderRadius: "50%" }}
        />
        <p>{chat.participants[0].name}</p>
      </DetailsDiv>
    </HeaderDiv>
  );
}