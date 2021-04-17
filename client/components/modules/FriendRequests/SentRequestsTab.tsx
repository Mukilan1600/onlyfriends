import React, { useContext, useEffect, useState } from 'react'
import ReactTimeago from 'react-time-ago';
import styles from './SentRequestsTab.module.css'
import { WebSocketContext } from '../../providers/WebSocketProvider'

export default function SentRequestsTab() {
    const { socket } = useContext(WebSocketContext);
    const [friendRequestsSent, setFriendRequestsSent] = useState([])

    useEffect(() => {
        socket.emit("get_friend_requests_sent");
        socket.on("friend_requests_sent",(msg) => setFriendRequestsSent(msg));
        return () => {
            socket.off("friend_requests_sent")
        }
    },[socket])

    return (
        <div>
            {friendRequestsSent.map((req,i) => (
                <div key={i} className={styles.listItem}>
                    <p>{req.user.name}</p>
                    <ReactTimeago date={req.createdAt}/>
                </div>
            ))}
        </div>
    )
}
