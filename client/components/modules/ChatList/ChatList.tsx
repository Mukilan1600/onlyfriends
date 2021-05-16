import React, { useContext, useEffect } from "react";
import Link from "next/link";
import styles from "./ChatList.module.css";

import { WebSocketContext } from "../../providers/WebSocketProvider";
import ChatListItem, { IChatListItem } from "./ChatListItem";
import useChatList from "../../stores/useChatList";
import useProfile from "../../stores/useProfile";
import Button from "../Button";
import EmptyChats from "../../statics/illustrations/EmptyChats";
import useChat, { IMessage } from "../../stores/useChat";
import useLoader from "../../stores/useLoader";
import Spinner from "../Spinner/Spinner";
import useCall from "../../stores/useCall";

const ChatsList: React.FC = () => {
  const notificationAudio = new Audio("/sounds/noti.wav");
  const { setLoader, chatListLoading } = useLoader();
  const { chats, setChats } = useChatList();
  const { socket } = useContext(WebSocketContext);
  const { user } = useProfile();

  const sendMessageAcknowledgements = (newMessages: IMessage[]) => {
    const { chat } = useChat.getState();
    const unAcknowledgedMessages = newMessages.filter(
      (message) => !message.readBy.includes(user._id)
    );
    if (unAcknowledgedMessages.length > 0)
      socket.emit(
        "acknowledge_messages",
        chat._id,
        unAcknowledgedMessages.map((msg) => msg._id)
      );
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("chat_list", (msg: IChatListItem[]) => {
      // Remove logged in user from list of participants
      const newChatList = msg.map((chat: IChatListItem) => {
        if (chat.chat.type === "group") return chat;
        var unread = 0;
        const newParticipants = chat.chat.participants.filter((participant) => {
          if (participant.user.oauthId === user.oauthId) {
            unread = participant.unread;
            return false;
          }
          return true;
        });
        chat.unread = unread;
        chat.chat.participants = newParticipants;
        return chat;
      });
      setChats(newChatList);
      useLoader.getState().setLoader({ chatListLoading: false });
    });

    socket.on("receive_message", (chatId: string, msg: IMessage) => {
      const {
        chat,
        setMessages,
        messages,
        setUnacknowledgedMessages,
        unacknowledgedMessages,
      } = useChat.getState();
      if (chat && chatId === chat._id) {
        messages.unshift(msg);
        setMessages(messages);
        if (document.hidden) {
          notificationAudio.play();
          setUnacknowledgedMessages([...unacknowledgedMessages, msg]);
        } else {
          sendMessageAcknowledgements([msg]);
        }
      } else if (msg.sentBy !== user._id) {
        const { chats, setChats } = useChatList.getState();
        const newChats = [...chats].map((chat) => {
          if (chat.chat._id !== chatId) return chat;
          else {
            return {
              ...chat,
              unread: (chat.unread ? chat.unread : 0) + 1,
            };
          }
        });
        setChats(newChats);
        notificationAudio.play();
      }
    });

    socket.on(
      "is_typing",
      (chatId: string, userId: string, isTyping: boolean) => {
        let { chats } = useChatList.getState();
        let { chat, setChat } = useChat.getState();
        const index = chats.findIndex((chat) => chat.chat._id === chatId);
        // Change for groups
        if (index > -1) {
          chats[index].chat.participants[0].user.isTyping = isTyping;
          setChats(chats);
        }

        if (chat && chat._id === chatId) {
          chat.participants[0].user.isTyping = isTyping;
          setChat(chat);
        }
      }
    );

    socket.emit("get_chat_list");
    setLoader({ chatListLoading: true });
    return () => {
      socket.off("is_typing");
      socket.off("chat_list");
      socket.off("receive_message");
      socket.off("update_friend_status");
    };
  }, [socket]);

  return (
    <div className={styles.body}>
      {chatListLoading && !chats ? (
        <Spinner />
      ) : (
        <>
          {chats &&
            (chats.length > 0 ? (
              chats.map((chat: IChatListItem, i: number) => (
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
                top: "calc(100% - 56px)",
                transform: "translate(-25%, -50%)",
                width: "250px",
                height: "58px",
                fontWeight: 600,
              }}
              label="Friend Requests"
            />
          </Link>
        </>
      )}
    </div>
  );
};

export default ChatsList;
