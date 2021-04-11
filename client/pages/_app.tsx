import React from "react";
import { AppProps } from "next/app";
import WebSocketProvider from "../components/providers/WebSocketProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}
