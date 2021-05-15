import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import useLoader from "../stores/useLoader";
import useProfile, { IUser } from "../stores/useProfile";
import useToken from "../stores/useToken";
import firebase from "firebase/app";
import "firebase/auth";
import useCall, { findUserFromChat, RejectReason } from "../stores/useCall";
import useChatList from "../stores/useChatList";
import { SignalData } from "simple-peer";

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
  const [socketStatus, setSocketStatus] =
    useState<ConnectionStatus>("connecting");
  const [socket, setSocket] = useState(null);
  const { jwtTok, clearTokens } = useToken();
  const { callState, receiveSignalData, rejectCall, callAccepted } = useCall();
  const router = useRouter();

  useEffect(() => {
    if (socket || !jwtTok) {
      setSocketStatus("disconnected");
      return;
    }

    setSocketStatus("connecting");
    const newSocket = io(process.env.NEXT_PUBLIC_SERVER, { query: { jwtTok } });
    var firebaseConfig = {
      apiKey: "AIzaSyCTvqxVRpAIp3cY4yvoC1ZL9mvFI5EDMN8",
      authDomain: "onlyfriend-aa0ea.firebaseapp.com",
      projectId: "onlyfriend-aa0ea",
      storageBucket: "onlyfriend-aa0ea.appspot.com",
      messagingSenderId: "218774560646",
      appId: "1:218774560646:web:71c4f46516fdcda1915607",
      measurementId: "G-RNCNN1CKX1",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

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

    newSocket.on("profile", (msg: IUser) => {
      firebase
        .auth()
        .signInWithCustomToken(msg.firebaseToken)
        .then(() => {
          useProfile.getState().setUser(msg);
        })
        .catch((error) => {
          console.error(error);
        });
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

    newSocket.on("incoming_call", (receiverId: string, video: boolean) => {
      if (callState.incomingCall || callState.inCall) {
        rejectCall("BUSY", receiverId);
      } else {
        callState.setReceiverProfile(
          findUserFromChat(useChatList.getState().chats, receiverId)
        );
        callState.setReceiverId(receiverId);
        callState.setStatus("call_incoming");
      }
    });

    newSocket.on("call_rejected", (reason: RejectReason) => {
      callState.setRejectReason(reason);
      callState.setStatus("call_rejected");
    });

    newSocket.on("call_accepted", callAccepted.bind(this, newSocket));

    newSocket.on("signal_data", receiveSignalData);

    setSocketStatus("connected");
    setSocket(newSocket);
  }, [jwtTok, firebase.auth]);

  // @todo Redirect to socket closed page
  if (socketStatus === "closed-by-server") return <>closed by server</>;

  return (
    <WebSocketContext.Provider value={{ socket, socketStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
