import React, { useContext } from "react";
import styled from "styled-components";
import { PeerCallContext, usePeerCallState } from "../../providers/PeerCallWrapper";
import EndCall from "../../statics/icons/EndCall";
import MicOn from "../../statics/icons/MicOn";
import SpeakerOn from "../../statics/icons/SpeakerOn";
import VideoOn from "../../statics/icons/VideoOn";
import useMediaConfigurations from "../../stores/call/useMediaConfiguration";
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

const ButtonPanel = styled.div`
  background: linear-gradient(95.16deg, #ff00c7 -24.95%, #3d98e7 124.85%);
  border-radius: 12px;
  padding: 0px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 44px;
  border: none;
  background: transparent;
  outline: none;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const CallPreview: React.FC = () => {
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { acceptCall } = useContext(PeerCallContext);
  const { mediaStream } = useMediaStream();
  const { hasAudio, hasVideo } = useMediaConfigurations();

  const toggleVideo = () => {
    callState.setUserState({
      ...callState.userState,
      video: !callState.userState.video,
    });
  };

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
            <TitleName>{callState.receiverProfile.name}</TitleName> incoming call...
          </>
        );
      case "call":
        return (
          <>
            In call with <TitleName>{callState.receiverProfile.name}</TitleName>
          </>
        );
    }
  };

  const getCallControls = () => {
    switch (callState.callStatus) {
      case "call_incoming":
        return (
          <>
            <button onClick={acceptCall.bind(this, false)}>Accept</button>
            <button>Reject</button>
          </>
        );
      case "call_outgoing":
        return (
          <>
            <button>Cancel</button>
          </>
        );
      case "call":
        return (
          <ButtonPanel>
            <ControlButton onClick={() => toggleVideo()}>
              <VideoOn />
            </ControlButton>
            <ControlButton>
              <SpeakerOn />
            </ControlButton>
            <ControlButton>
              <MicOn />
            </ControlButton>
            <ControlButton>
              <EndCall />
            </ControlButton>
          </ButtonPanel>
        );
    }
  };

  return (
    <PreviewWrapper closed={callState.callStatus === "idle"}>
      {callState.callStatus !== "idle" && (
        <>
          <CallStatus>{getPreviewStatus()}</CallStatus>
          <div style={{ display: "flex" }}>
            <VideoPreview avatarUrl={user.avatarUrl} muted={true} video={mediaStream} enabled={callState.userState.video} />
            <VideoPreview avatarUrl={callState.receiverProfile.avatarUrl} video={callState.receiverStream} enabled={callState.receiverState.video} />
          </div>

          <div style={{ display: "flex" }}>{getCallControls()}</div>
        </>
      )}
    </PreviewWrapper>
  );
};

export default CallPreview;
