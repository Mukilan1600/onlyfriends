import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { WebSocketContext } from "../components/providers/WebSocketProvider";
import GoogleLogoIcon from "../components/statics/icons/GoogleLogoIcon";
import useSaveQueryParamsToken from "../components/stores/useSaveQueryParamsToken";

const Login: React.FC = () => {
  useSaveQueryParamsToken();
  const { socketStatus } = useContext(WebSocketContext);
  const router = useRouter();
  useEffect(() => {
    if (socketStatus === "connected") router.push("/home");
  }, [socketStatus]);
  return (
    <div style={{backgroundColor: 'gray'}}>
      <GoogleLogoIcon />
      <a href={`${process.env.NEXT_PUBLIC_SERVER}/api/auth/oauth`}>
        Sign in with google
      </a>
    </div>
  );
};

export default Login;
