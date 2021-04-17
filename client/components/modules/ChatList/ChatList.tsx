import React, { useContext, useEffect } from "react";
import Link from "next/link";
import styles from "./ChatList.module.css";

import { WebSocketContext } from "../../providers/WebSocketProvider";
import ChatListItem, { IChatListItem } from "./ChatListItem";
import useChatList from "../../stores/useChatList";
import useProfile from "../../stores/useProfile";

const ChatsList: React.FC = () => {
  const { chats, setChats } = useChatList();
  const { socket } = useContext(WebSocketContext);
  const { user } = useProfile();

  useEffect(() => {
    if (!socket) return;
    socket.on("chat_list", (msg: IChatListItem[]) => {
      // Remove logged in user from list of participants
      const newChatList = msg.map((chat: IChatListItem) => {
        if (chat.chat.type === "group") return chat;
        const newParticipants = chat.chat.participants.filter(
          (participant) => participant.oauthId !== user.oauthId
        );
        chat.chat.participants = newParticipants;
        return chat;
      });
      console.log(newChatList);
      setChats(newChatList);
    });

    socket.on("update_friend_status", (msg) => {
      const { chats } = useChatList.getState();
      setChats(
        chats.map((chat) => {
          const newParticipants = chat.chat.participants.map((participant) => {
            if (participant.oauthId === msg.oauthId) {
              return { ...participant, ...msg };
            } else return participant;
          });
          chat.chat.participants = newParticipants;
          return chat;
        })
      );
    });

    socket.emit("get_chat_list");
    return () => {
      socket.off("chat_list");
      socket.off("update_friend_status");
    };
  }, [socket]);

  return (
    <div className={styles.body}>
      {chats &&
        chats.map((chat, i) => (
          <ChatListItem key={i} unread={chat.unread} chat={chat.chat} />
        ))}
      <Link href="/friendrequests">
        <div className={styles.btnAddFriends}>Friend Requests</div>
      </Link>
    </div>
  );
};

export default ChatsList;
