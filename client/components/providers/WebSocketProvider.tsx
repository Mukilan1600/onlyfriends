import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import useLoader from "../stores/useLoader";
import useProfile from "../stores/useProfile";
import useToken from "../stores/useToken";

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "closed-by-server"
  | "disconnected";

export const WebSocketContext = createContext<{
  socket: Socket;
  socketStatus: ConnectionStatus;
}>({
  socket: null,
  socketStatus: "connecting",
});

interface ConnectionError {
  code: number;
  msg: string;
}

const WebSocketProvider: React.FC<{}> = ({ children }) => {
  const [socketStatus, setSocketStatus] = useState<ConnectionStatus>(
    "connecting"
  );
  const [socket, setSocket] = useState(null);
  const { jwtTok, clearTokens } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (socket || !jwtTok) {
      setSocketStatus("disconnected");
      return;
    }

    setSocketStatus("connecting");
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER, { query: { jwtTok } });

    newSocket.on("disconnect", (msg) => {
      if (msg === "io server disconnect") {
        setSocketStatus("closed-by-server");
      } else {
        setSocketStatus("disconnected");
      }
      setSocket(null);
    });

    newSocket.on("connect_error", (msg) => {
      const error: ConnectionError = JSON.parse(msg.message);
      if (error.code === 401) {
        clearTokens();
        setSocket(null);
        router.push("/");
      } else {
        setSocket(null);
      }
      setSocketStatus("disconnected");
    });

    newSocket.on("profile", (msg) => {
      useProfile.getState().setUser(msg);
    });

    newSocket.on("success", (msg) => {
      toast(msg.msg, { type: "success" });
      useLoader.getState().clearLoaders();
    });

    newSocket.on("error", (msg, code) => {
      if (code === 401) {
        clearTokens();
      }
      toast(msg.msg, { type: "error" });
      useLoader.getState().clearLoaders();
    });
    setSocketStatus("connected");
    setSocket(newSocket);
  }, [jwtTok]);

  // @todo Redirect to socket closed page
  if (socketStatus === "closed-by-server") return <>closed by server</>;

  return (
    <WebSocketContext.Provider value={{ socket, socketStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
