import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useToken from "../stores/useToken";

type ConnectionStatus = "connecting" | "connected" | "closed-by-server" | "disconnected"

const WebSocketContext = createContext({
  socket: null,
  socketStatus: "connecting",
});

interface ConnectionError {
  code: number,
  msg: string
}

const WebSocketProvider: React.FC<{}> = ({ children }) => {
  const [socketStatus, setSocketStatus] = useState<ConnectionStatus>("connecting");
  const [socket, setSocket] = useState(null);
  const { jwtTok, clearTokens } = useToken();
  const router = useRouter();

  useEffect(() => {
    if(socket || !jwtTok) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SERVER, { query: { jwtTok } });
    newSocket.on("disconnect", (msg) => {
      if(msg==="io server disconnect"){
        setSocketStatus("closed-by-server");
      }else{
        setSocketStatus("disconnected")
      }
      setSocket(null);
    });
    newSocket.on("connect_error", (msg) => {
      const error: ConnectionError = JSON.parse(msg.message);
      if(error.code === 401){
        clearTokens();
        setSocket(null);
        router.push("/login");
      }else{
        setSocket(null);
      }
    });
    setSocketStatus("connected")
    setSocket(newSocket);
  }, [jwtTok]);

  return (
    <WebSocketContext.Provider value={{ socket, socketStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
