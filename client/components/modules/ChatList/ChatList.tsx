import React, { useContext, useEffect } from "react";
import Link from "next/link";
import styles from "./ChatList.module.css";

import { WebSocketContext } from "../../providers/WebSocketProvider";
import ChatListItem, { IChatListItem } from "./ChatListItem";
import useChatList from "../../stores/useChatList";
import useProfile from "../../stores/useProfile";
import Button from "../Button";
import EmptyChats from "../../statics/illustrations/EmptyChats";

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
          (participant) => participant.user.oauthId !== user.oauthId
        );
        chat.chat.participants = newParticipants;
        return chat;
      });
      setChats(newChatList);
    });

    socket.on("update_friend_status", (msg) => {
      const { chats } = useChatList.getState();
      setChats(
        chats.map((chat) => {
          const newParticipants = chat.chat.participants.map((participant) => {
            if (participant.user.oauthId === msg.oauthId) {
              return { ...participant, user: { ...participant.user, ...msg } };
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
        (chats.length > 0 ? (
          chats.map((chat, i) => (
            <ChatListItem key={i} unread={chat.unread} chat={chat.chat} />
          ))
        ) : (
          <div className={styles.illustrationHolder}>
            <p>Friend Request to get started</p>
            <EmptyChats />
          </div>
        ))}
      <Link href="/friendrequests">
        <Button
          style={{
            position: "sticky",
            left: "50%",
            top: "82.5%",
            transform: "translate(-25%, 0)",
            width: "250px",
            height: "58px",
            fontWeight: 600,
          }}
          label="Friend Requests"
        />
      </Link>
    </div>
  );
};

export default ChatsList;
