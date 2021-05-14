import React from "react";
import styled from "styled-components";
import useCall from "../../stores/useCall";
import useProfile from "../../stores/useProfile";
import VideoPreview from "./VideoPreview";

const PreviewWrapper = styled.div<{ closed: boolean }>`
  width: 100%;
  height: ${({ closed }) => (closed ? "0px" : "267px")};
  transition: height 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const TitleName = styled.span`
  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 21px;
  color: #000;
`;

const CallStatus = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.54);
`;

const CallPreview: React.FC = () => {
  const { user } = useProfile();
  const { callState } = useCall();

  const getPreviewStatus = () => {
    switch (callState.callStatus) {
      case "call_outgoing":
        return (
          <>
            <TitleName>{callState.receiverProfile.name}</TitleName> calling...
          </>
        );
      case "call_incoming":
        return (
          <>
            <TitleName>{callState.receiverProfile.name}</TitleName> incoming
            call...
          </>
        );
    }
  };

  return (
    <PreviewWrapper closed={callState.callStatus === "idle"}>
      {callState.callStatus !== "idle" && (
        <>
          <CallStatus>{getPreviewStatus()}</CallStatus>
          <div style={{ display: "flex" }}>
            <VideoPreview avatarUrl={user.avatarUrl} muted={true} />
            <VideoPreview avatarUrl={callState.receiverProfile.avatarUrl} />
          </div>
        </>
      )}
    </PreviewWrapper>
  );
};

export default CallPreview;
