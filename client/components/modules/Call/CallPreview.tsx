import React from "react";
import styled from "styled-components";
import useMediaStream from "../../stores/call/useMediaStream";
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
  const { callState, acceptCall } = useCall();
  const { mediaStream } = useMediaStream();

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

  const getCallControls = () => {
    switch (callState.callStatus) {
      case "call_incoming":
        return (
          <>
            <button onClick={acceptCall}>Accept</button>
            <button>Reject</button>
          </>
        );
      case "call_outgoing":
        return (
          <>
            <button>Cancel</button>
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
            <VideoPreview
              avatarUrl={user.avatarUrl}
              muted={true}
              video={mediaStream}
            />
            <VideoPreview
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream}
            />
          </div>

          <div style={{ display: "flex" }}>{getCallControls()}</div>
        </>
      )}
    </PreviewWrapper>
  );
};

export default CallPreview;
