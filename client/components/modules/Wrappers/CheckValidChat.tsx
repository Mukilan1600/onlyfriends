import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { WebSocketContext } from '../../providers/WebSocketProvider';
import useChat from '../../stores/useChat';
import { IChat } from '../ChatList/ChatListItem';

const CheckValidChat: React.FC = ({children}) => {
    const router = useRouter();
    const { socket } = useContext(WebSocketContext)
    const { setChat } = useChat();
    useEffect(() => {
        socket.emit("get_chat_details",router.query.id);
        socket.on("chat_details",(chat: IChat) => {
            if(!chat)
                router.push("/home")
            setChat(chat);
        })

        return () => {
            socket.off("chat_details");
        }
    },[router.query.id])

    return (
        <div>
            {children}
        </div>
    )
}

export default CheckValidChat