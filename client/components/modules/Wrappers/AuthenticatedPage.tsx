import { useRouter } from "next/router";
import React, { useContext } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useProfile from "../../stores/useProfile";

const AuthenticatedPage: React.FC = (props) => {
  const { socketStatus } = useContext(WebSocketContext);
  const { user } = useProfile();
  const router = useRouter();

  // @todo better loader

  if (socketStatus === "disconnected") {
    router.push("/");
    return null;
  }

  if (socketStatus === "connecting" || !user) return <div>Loading...</div>;

  return <>{props.children}</>;
};

export default AuthenticatedPage;
