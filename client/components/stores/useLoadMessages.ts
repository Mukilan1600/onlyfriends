import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import useChat, { IMessage } from "./useChat";
import useChatList from "./useChatList";
import useLoader from "./useLoader";
import useProfile from "./useProfile";

interface IUseLoadMessages {
  loadMoreMessages: () => void;
}

const useLoadMessages = (): IUseLoadMessages => {
  const { user } = useProfile();
  const { socket } = useContext(WebSocketContext);
  const { messages, chat, reachedEnd, resetChat, setReachedEnd, setMessages } = useChat();
  const { setLoader } = useLoader();

  const sendMessageAcknowledgements = (newMessages: IMessage[]) => {
    const unAcknowledgedMessages = newMessages.filter((message) => !message.readBy.includes(user._id));
    if (unAcknowledgedMessages.length > 0)
      socket.emit(
        "acknowledge_messages",
        chat._id,
        unAcknowledgedMessages.map((msg) => msg._id)
      );
  };

  useEffect(() => {
    loadMoreMessages();
    socket.on("messages", (newMessages: IMessage[]) => {
      const { setMessages, messages } = useChat.getState();
      if (newMessages.length === 0) setReachedEnd(true);
      messages.push(...newMessages);
      setMessages(messages);
      setLoader({ messagesLoading: false });
      sendMessageAcknowledgements(newMessages);
    });

    socket.on("message_acks", (chatId: string, messageIds: string[], userId: string) => {
      if (chatId !== chat._id) return;
      const { messages } = useChat.getState();
      const { setChats, chats } = useChatList.getState();
      if (chats) {
        const newChats = [...chats].map((chatI) => {
          if (chatI.chat._id === chat._id) return { ...chatI, unread: chatI.unread - messageIds.length };
          else return chatI;
        });
        setChats(newChats);
      }
      setMessages(
        messages.map((message) => {
          if (messageIds.includes(message._id) && !message.readBy.includes(userId)) message.readBy.push(userId);
          return message;
        })
      );
    });

    return () => {
      socket.off("messages");
      socket.off("message_acks");
      resetChat();
    };
  }, [socket]);

  const loadMoreMessages = () => {
    if (!reachedEnd) {
      socket.emit("get_messages", chat._id, messages.length);
      setLoader({ messagesLoading: true });
    }
  };

  return { loadMoreMessages };
};

export default useLoadMessages;
