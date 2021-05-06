import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useChat from "../../stores/useChat";
import useMessage from "../../stores/useMessage";
import useProfile, { IUser } from "../../stores/useProfile";
import { IChat } from "../ChatList/ChatListItem";
import CircularSpinner from "../Spinner/CircularSpinner";
import { LoaderDiv } from "./AuthenticatedPage";

const CheckValidChat: React.FC = ({ children }) => {
  const router = useRouter();
  const { user } = useProfile();
  const { socket } = useContext(WebSocketContext);
  const { chat, setChat, resetChat } = useChat();
  const { setReplyTo } = useMessage();
  useEffect(() => {
    socket.emit("get_chat_details", router.query.id);
    socket.on("chat_details", (chat: IChat) => {
      if (!chat) {
        router.push("/home");
        return;
      }
      // Remove logged in user from list of participants
      const newParticipants = chat.participants.filter((participant) => {
        return participant.user.oauthId !== user.oauthId;
      });
      setChat({ ...chat, participants: newParticipants });
    });

    return () => {
      socket.off("chat_details");
      resetChat();
      setReplyTo(null);
    };
  }, [router.query.id]);

  if (!chat)
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <LoaderDiv>
          <CircularSpinner />
        </LoaderDiv>
      </div>
    );
  return <>{children}</>;
};

export default CheckValidChat;
