import React from "react";
import { AppProps } from "next/app";
import WebSocketProvider from "../components/providers/WebSocketProvider";

const isServer = typeof window === "undefined";

export type PageComponent<T> = React.FC<T> & { ws?: boolean };

export default function App({ Component, pageProps }: AppProps) {
  if (isServer && (Component as PageComponent<unknown>).ws) return null;

  return (
    <WebSocketProvider>
      <Component {...pageProps} />
    </WebSocketProvider>
  );
}
