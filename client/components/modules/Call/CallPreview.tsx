import React, { useContext } from "react";
import styled from "styled-components";
import { PeerCallContext, usePeerCallState } from "../../providers/PeerCallWrapper";
import CallAcceptIcon from "../../statics/icons/CallAcceptIcon";
import CallRejectIcon from "../../statics/icons/CallRejectIcon";
import EndCall from "../../statics/icons/EndCall";
import MicOff from "../../statics/icons/MicOff";
import MicOn from "../../statics/icons/MicOn";
import SpeakerOff from "../../statics/icons/SpeakerOff";
import SpeakerOn from "../../statics/icons/SpeakerOn";
import StatusDeafenedIcon from "../../statics/icons/StatusDeafenedIcon";
import StatusMutedIcon from "../../statics/icons/StatusMutedIcon";
import VideoOff from "../../statics/icons/VideoOff";
import VideoOn from "../../statics/icons/VideoOn";
import useMediaConfigurations from "../../stores/call/useMediaConfiguration";
import useMediaStream from "../../stores/call/useMediaStream";
import useProfile from "../../stores/useProfile";
import VideoPreview from "./VideoPreview";

const PreviewWrapper = styled.div<{ closed: boolean }>`
  width: 100%;
  min-height: ${({ closed }) => (closed ? "0px" : "267px")};
  transition: min-height 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
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
  display: flex;
  align-items: center;
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

const CallAcceptButton = styled.button`
  width: 70px;
  height: 42px;
  border: 1px solid #18ff21;
  box-sizing: border-box;
  border-radius: 19px 0px 0px 19px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;

  &:hover {
    background: rgba(24, 255, 33, 0.1);
  }
`;

const CallRejectButton = styled.button<{ borderAll?: boolean }>`
  width: 70px;
  height: 42px;
  border: 1px solid #ff1818;
  box-sizing: border-box;
  border-radius: ${({ borderAll }) => (borderAll ? "19px" : "0px 19px 19px 0px")};
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;

  &:hover {
    background: rgba(255, 24, 24, 0.1);
  }
`;

const CallPreview: React.FC = () => {
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { acceptCall, endCall } = useContext(PeerCallContext);
  const { mediaStream } = useMediaStream();
  const { hasAudio, hasVideo } = useMediaConfigurations();

  const toggleVideo = () => {
    const videoTracks = mediaStream.getVideoTracks();
    let video = !callState.userState.video;
    if (videoTracks.length < 1 && video) video = false;
    callState.setUserState({
      ...callState.userState,
      video,
    });
  };

  const toggleAudio = () => {
    const audioTracks = mediaStream.getAudioTracks();
    let muted = !callState.userState.muted;
    if (audioTracks.length < 1 && !muted) muted = true;
    callState.setUserState({
      ...callState.userState,
      muted,
      deafened: false,
    });
  };

  const toggleSpeaker = () => {
    callState.setUserState({
      ...callState.userState,
      deafened: !callState.userState.deafened,
      muted: !callState.userState.deafened,
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
            <CallAcceptButton onClick={acceptCall.bind(this, false)}>
              <CallAcceptIcon />
            </CallAcceptButton>
            <CallRejectButton onClick={endCall}>
              <CallRejectIcon />
            </CallRejectButton>
          </>
        );
      case "call_outgoing":
        return (
          <>
            <CallRejectButton onClick={endCall} borderAll={true}>
              <CallRejectIcon />
            </CallRejectButton>
          </>
        );
      case "call":
        return (
          <ButtonPanel>
            <ControlButton onClick={toggleVideo}>{callState.userState.video ? <VideoOn /> : <VideoOff />}</ControlButton>
            <ControlButton onClick={toggleSpeaker}>{callState.userState.deafened ? <SpeakerOff /> : <SpeakerOn />}</ControlButton>
            <ControlButton onClick={toggleAudio}>{callState.userState.muted ? <MicOff /> : <MicOn />}</ControlButton>
            <ControlButton onClick={endCall}>
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
          <CallStatus>
            <p>{getPreviewStatus()}</p>
            {callState.receiverState.deafened ? (
              <StatusDeafenedIcon />
            ) : callState.receiverState.muted ? (
              <StatusMutedIcon />
            ) : (
              <span style={{ width: "25px", height: "25px", margin: "0px 8px" }} />
            )}
          </CallStatus>
          <div style={{ display: "flex" }}>
            <VideoPreview avatarUrl={user.avatarUrl} muted={true} video={mediaStream} enabled={callState.userState.video} />
            <VideoPreview
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream}
              enabled={callState.receiverState.video}
              muted={callState.userState.deafened}
            />
          </div>

          <div style={{ display: "flex" }}>{getCallControls()}</div>
        </>
      )}
    </PreviewWrapper>
  );
};

export default CallPreview;
