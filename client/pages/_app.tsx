import "../styles/globals.css";
import React from "react";
import { AppProps } from "next/app";
import WebSocketProvider from "../components/providers/WebSocketProvider";
import { PageComponenet } from "../types";
import  TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.locale(en)

const isServer = typeof window === "undefined";

export default function App({ Component, pageProps }: AppProps) {
  if (isServer && (Component as PageComponenet).noRedirect) return null;
  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}