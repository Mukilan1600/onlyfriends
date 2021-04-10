import { useRouter } from "next/router";
import React, { useContext } from "react";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useProfile from "../../stores/useProfile";

const AuthenticatedPage: React.FC = (props) => {
  const { socketStatus } = useContext(WebSocketContext);
  const { user } = useProfile();
  const router = useRouter();

  // @todo better loader
  if (socketStatus === "connecting") return <>Loading...</>;

  if (!user) {
    router.push("/");
    return null;
  }

  return <>{props.children}</>;
};

export default AuthenticatedPage;
