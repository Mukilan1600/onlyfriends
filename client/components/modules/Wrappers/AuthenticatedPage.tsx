import { useRouter } from "next/router";
import React, { useContext } from "react";
import styled from "styled-components";
import { WebSocketContext } from "../../providers/WebSocketProvider";
import useProfile from "../../stores/useProfile";
import CircularSpinner from "../Spinner/CircularSpinner";

const LoaderDiv = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
`;

const AuthenticatedPage: React.FC = (props) => {
  const { socketStatus } = useContext(WebSocketContext);
  const { user } = useProfile();
  const router = useRouter();

  if (socketStatus === "disconnected") {
    router.push("/");
    return null;
  }

  if (socketStatus === "connecting" || !user) 
    return (
      <LoaderDiv>
        <CircularSpinner />
      </LoaderDiv>
    );

  return <>{props.children}</>;
};

export default AuthenticatedPage;
