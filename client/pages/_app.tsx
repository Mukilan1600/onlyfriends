import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "nprogress/nprogress.css";
import "emoji-mart/css/emoji-mart.css";
import React from "react";
import NProgress from "nprogress";
import { AppProps } from "next/app";
import { Router } from "next/router";
import WebSocketProvider from "../components/providers/WebSocketProvider";
import { PageComponenet } from "../types";
import { ToastContainer, Flip } from "react-toastify";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Headers from "../components/modules/Headers/Headers";
import PeerCallWrapper from "../components/providers/PeerCallWrapper";

TimeAgo.locale(en);

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const isServer = typeof window === "undefined";

export default function App({ Component, pageProps }: AppProps) {
  if (isServer && (Component as PageComponenet).noRedirect) return null;
  return (
    <>
      <Headers />
      <WebSocketProvider>
        <PeerCallWrapper>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            limit={3}
            transition={Flip}
            closeButton={false}
            pauseOnHover
          />
        </PeerCallWrapper>
      </WebSocketProvider>
    </>
  );
}
