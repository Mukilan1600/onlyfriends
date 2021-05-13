import React from "react";
import useChat from "../../../../stores/useChat";

const StatusIndicator: React.FC = () => {
  const { chat } = useChat();
  return (
    <p style={{ fontSize: "12px", fontWeight: "normal", lineHeight: "16px",height: "16px" }}>
      {chat.participants[0].user.isTyping ? "Typing..." : " "}
    </p>
  );
};

export default StatusIndicator;
