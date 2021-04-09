import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useToken from "../stores/useToken";

const WebSocketContext = createContext({
  socket: null,
  socketStatus: "connecting",
});

const WebSocketProvider: React.FC = ({ children }) => {
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const { jwtTok } = useToken();
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER, { query: { jwtTok } });
    newSocket.on("disconnect", (msg) => console.log(msg));
    setSocket(newSocket);
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, socketStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
