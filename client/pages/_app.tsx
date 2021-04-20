import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { AppProps } from "next/app";
import WebSocketProvider from "../components/providers/WebSocketProvider";
import { PageComponenet } from "../types";
import { ToastContainer } from "react-toastify";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Headers from "../components/modules/Headers/Headers";

TimeAgo.locale(en);

const isServer = typeof window === "undefined";

export default function App({ Component, pageProps }: AppProps) {
  if (isServer && (Component as PageComponenet).noRedirect) return null;
  return (
    <>
      <Headers />
      <WebSocketProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
        />
      </WebSocketProvider>
    </>
  );
}
