import React from "react";
import useChat from "../../../../stores/useChat";

const StatusIndicator: React.FC = () => {
  const { chat } = useChat();
  return chat.participants[0].user.isTyping ? (
    <p style={{ fontSize: "12px", fontWeight: "normal", lineHeight: "16px" }}>
      Typing...
    </p>
  ) : null;
};

export default StatusIndicator;
