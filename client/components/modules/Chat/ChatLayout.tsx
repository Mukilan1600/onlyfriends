import React from "react";
import styled from "styled-components";

const ChatLayoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
`;

const ChatLayout: React.FC = ({ children }) => {
  return <ChatLayoutWrapper>{children}</ChatLayoutWrapper>;
};

export default ChatLayout;
