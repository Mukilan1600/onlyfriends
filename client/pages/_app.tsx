import "../styles/globals.css";
import React from "react";
import { AppProps } from "next/app";
import WebSocketProvider from "../components/providers/WebSocketProvider";
import { PageComponenet } from "../types";

const isServer = typeof window === "undefined";

export default function App({ Component, pageProps }: AppProps) {
  if (isServer && (Component as PageComponenet).noRedirect) return null;
  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}
