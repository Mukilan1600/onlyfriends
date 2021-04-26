import React from "react";
import styled from "styled-components";

const ChatLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 380px);
`;

const ChatLayout: React.FC = ({ children }) => {
  return <ChatLayoutWrapper>{children}</ChatLayoutWrapper>;
};

export default ChatLayout;
