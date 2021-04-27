import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../providers/WebSocketProvider";
import useChat, { IMessage } from "./useChat";
import useLoader from "./useLoader";

interface IUseLoadMessages {
  loadMoreMessages: () => void;
}

const useLoadMessages = (): IUseLoadMessages => {
  const { socket } = useContext(WebSocketContext);
  const { messages, chat, reachedEnd, resetChat, setReachedEnd } = useChat();
  const { setLoader } = useLoader();

  useEffect(() => {
    loadMoreMessages();
    socket.on("messages", (newMessages: IMessage[]) => {
      const { setMessages, messages } = useChat.getState();
      if (newMessages.length === 0) setReachedEnd(true);
      messages.push(...newMessages);
      setMessages(messages);
      setLoader({ messagesLoading: false, ...useLoader.getState() });
    });

    /** @Mukilan1600 update unread messages  */
    socket.on("receive_message", (chatId: string, msg: IMessage) => {
      if (chatId === chat._id) {
        const { setMessages, messages } = useChat.getState();
        messages.unshift(msg);
        setMessages(messages);
      }
    });

    return () => {
      socket.off("messages");
      socket.off("receive_message");
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
