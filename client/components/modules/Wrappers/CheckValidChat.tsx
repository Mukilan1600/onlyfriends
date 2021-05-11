import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useChat from "../../stores/useChat";
import useChatList from "../../stores/useChatList";
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
      const { setChats, chats } = useChatList.getState();
      if (chats) {
        const newChats = [...chats].map((chatI) => {
          if (chatI.chat._id === chat._id) return { ...chatI, unread: 0 };
          else return chatI;
        });
        setChats(newChats);
      }
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
