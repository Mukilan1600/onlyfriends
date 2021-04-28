import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import useChat, { IMessage } from "./useChat";
import useLoader from "./useLoader";
import useProfile from "./useProfile";

interface IUseLoadMessages {
  loadMoreMessages: () => void;
}

const useLoadMessages = (): IUseLoadMessages => {
  const { user } = useProfile();
  const { socket } = useContext(WebSocketContext);
  const {
    messages,
    chat,
    reachedEnd,
    resetChat,
    setReachedEnd,
    setMessages,
  } = useChat();
  const { setLoader } = useLoader();

  const sendMessageAcknowledgements = (newMessages: IMessage[]) => {
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
    loadMoreMessages();
    socket.on("messages", (newMessages: IMessage[]) => {
      const { setMessages, messages } = useChat.getState();
      if (newMessages.length === 0) setReachedEnd(true);
      messages.push(...newMessages);
      setMessages(messages);
      setLoader({ messagesLoading: false, ...useLoader.getState() });
      sendMessageAcknowledgements(newMessages);
    });

    /** @Mukilan1600 update unread messages  */
    socket.on("receive_message", (chatId: string, msg: IMessage) => {
      if (chatId === chat._id) {
        const { setMessages, messages } = useChat.getState();
        messages.unshift(msg);
        setMessages(messages);
        sendMessageAcknowledgements([msg]);
      }
    });

    socket.on("message_acks", (chatId: string, messageIds: string[]) => {
      if (chatId !== chat._id) return;
      const { messages } = useChat.getState();
      setMessages(
        messages.map((message) => {
          if (
            messageIds.includes(message._id) &&
            !message.readBy.includes(user._id)
          )
            message.readBy.push(user._id);
          return message;
        })
      );
    });

    return () => {
      socket.off("messages");
      socket.off("receive_message");
      socket.off("message_acks");
      resetChat();
    };
  }, [socket]);

  const loadMoreMessages = () => {
    if (!reachedEnd) {
      socket.emit("get_messages", chat._id, messages.length);
      setLoader({ messagesLoading: true, ...useLoader.getState() });
    }
  };

  return { loadMoreMessages };
};

export default useLoadMessages;
