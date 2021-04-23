import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useChat from "../../stores/useChat";
import useProfile, { IUser } from "../../stores/useProfile";
import { IChat } from "../ChatList/ChatListItem";

const CheckValidChat: React.FC = ({ children }) => {
  const router = useRouter();
  const { user } = useProfile()
  const { socket } = useContext(WebSocketContext);
  const { chat, setChat, setMessages } = useChat();
  useEffect(() => {
    socket.emit("get_chat_details", router.query.id);
    socket.on("chat_details", (chat: IChat) => {
      if (!chat) router.push("/home");
      // Remove logged in user from list of participants
      const newParticipants = chat.participants.filter((participant: IUser) => {
          return participant.oauthId !== user.oauthId
      });
      setChat({...chat, participants: newParticipants});
    });

    return () => {
      socket.off("chat_details");
      setChat(null);
      setMessages([]);
    };
  }, [router.query.id]);

  if (!chat) return <>Loading...</>;
  return <>{children}</>;
};

export default CheckValidChat;