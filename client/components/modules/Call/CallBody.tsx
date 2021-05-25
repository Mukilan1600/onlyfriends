import React, { useRef, useState } from "react";
import styled from "styled-components";
import { usePeerCallState } from "../../providers/PeerCallWrapper";
import StatusDeafenedIcon from "../../statics/icons/StatusDeafenedIcon";
import StatusMutedIcon from "../../statics/icons/StatusMutedIcon";
import GearIcon from "../../statics/icons/GearIcon";
import useMediaStream from "../../stores/call/useMediaStream";
import useProfile from "../../stores/useProfile";
import CallControls from "./components/CallControls";
import VideoPreview from "./components/VideoPreview";
import VideoStreamsCarousel, { StreamHolder, StreamTitle } from "./components/VideoStreamsCarousel";
import VolumeSlider, { VolumeSliderWrapper } from "./components/VolumeSlider";
import CallSettingsModal from "./components/CallSettingsModal";
import useCallSounds from "../../stores/call/useCallSounds";

const CallBodyWrapper = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 70px);
`;

const CallControlsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .settings-btn {
    opacity: 0;
  }

  &:hover .settings-btn {
    opacity: 100%;
  }

  &:hover ${VolumeSliderWrapper} {
    opacity: 100%;

    input {
      width: 60%;
    }
  }
`;

export type CurrentStream = "user-video" | "receiver-video" | "user-screen" | "receiver-screen";

const CallBody: React.FC = () => {
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [currentStream, setCurrentStream] = useState<CurrentStream>("receiver-video");
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { mediaStream, displayMediaStream } = useMediaStream();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { playToggleOn, playToggleOff } = useCallSounds(audioRef);

  const VIDEO_WIDTH = "100%",
    VIDEO_HEIGHT = currentStream === "receiver-screen" ? "calc(100vh - 154px)" : "calc(100vh - 205px)";

  const getCurrentVideoStream = () => {
    switch (currentStream) {
      case "receiver-screen":
        return (
          <StreamHolder>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream[1]}
              enabled={callState.receiverState.sharingScreen}
              muted={true}
            />
            <div style={{ height: "10px" }}></div>
          </StreamHolder>
        );
      case "receiver-video":
        return (
          <StreamHolder>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream[0]}
              enabled={callState.receiverState.video}
              muted={true}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <StreamTitle>{callState.receiverProfile.name}</StreamTitle>
              {callState.receiverState.deafened ? (
                <StatusDeafenedIcon />
              ) : callState.receiverState.muted ? (
                <StatusMutedIcon />
              ) : (
                <span style={{ width: "25px", height: "25px", marginLeft: "8px" }} />
              )}
            </div>
          </StreamHolder>
        );
      case "user-video":
        return (
          <StreamHolder>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={user.avatarUrl}
              muted={true}
              video={mediaStream}
              enabled={callState.userState.video}
            />
            <StreamTitle>{user.name}</StreamTitle>
          </StreamHolder>
        );
      case "user-screen":
        return (
          <StreamHolder>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={user.avatarUrl}
              video={displayMediaStream}
              enabled={callState.userState.sharingScreen}
              muted={true}
            />
            <StreamTitle>{user.name}</StreamTitle>
          </StreamHolder>
        );
      default:
        return (
          <StreamHolder>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream[0]}
              enabled={callState.receiverState.video}
              muted={callState.userState.deafened}
            />
            <div style={{ display: "flex", alignItems: "center" }}>
              <StreamTitle>{callState.receiverProfile.name}</StreamTitle>
              {callState.receiverState.deafened ? (
                <StatusDeafenedIcon />
              ) : callState.receiverState.muted ? (
                <StatusMutedIcon />
              ) : (
                <span style={{ width: "25px", height: "25px", marginLeft: "8px" }} />
              )}
            </div>
          </StreamHolder>
        );
    }
  };

  return (
    <CallBodyWrapper>
      <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%", alignItems: "center" }}>
        <div style={{ width: "100%", maxHeight: "calc(100vh - 100px)", padding: "0px 100px" }}>
          {getCurrentVideoStream()}
          <CallControlsWrapper>
            <div style={{ width: "100%" }}>
              {callState.callStatus === "call" && (
                <span
                  className="settings-btn"
                  style={{ float: "right", margin: "0px 15px", cursor: "pointer", transition: "opacity 0.1s ease-in" }}
                  onClick={setSettingsModalOpen.bind(this, true)}
                >
                  <GearIcon />
                </span>
              )}
            </div>
            <CallControls playToggleOn={playToggleOn} playToggleOff={playToggleOff} />
            <VolumeSlider />
          </CallControlsWrapper>
        </div>
        <VideoStreamsCarousel setStream={setCurrentStream} currentStream={currentStream} />
      </div>
      <CallSettingsModal open={settingsModalOpen} onClose={setSettingsModalOpen.bind(this, false)} />
      <audio ref={audioRef} />
    </CallBodyWrapper>
  );
};

export default CallBody;
