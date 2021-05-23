import React, { useState } from "react";
import styled from "styled-components";
import { usePeerCallState } from "../../providers/PeerCallWrapper";
import StatusDeafenedIcon from "../../statics/icons/StatusDeafenedIcon";
import StatusMutedIcon from "../../statics/icons/StatusMutedIcon";
import useMediaStream from "../../stores/call/useMediaStream";
import useProfile from "../../stores/useProfile";
import CallControls from "./components/CallControls";
import VideoPreview from "./components/VideoPreview";
import VideoStreamsCarousel, { StreamHolder, StreamTitle } from "./components/VideoStreamsCarousel";
import VolumeSlider from "./components/VolumeSlider";

const CallBodyWrapper = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CallControlsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export type CurrentStream = "user-video" | "receiver-video" | "user-screen" | "receiver-screen";

const VIDEO_WIDTH = 657,
  VIDEO_HEIGHT = 370;

const CallBody: React.FC = () => {
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { mediaStream, displayMediaStream } = useMediaStream();
  const [currentStream, setCurrentStream] = useState<CurrentStream>("receiver-video");

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
              muted={callState.userState.deafened}
            />
            <StreamTitle>{callState.receiverProfile.name}</StreamTitle>
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
        {getCurrentVideoStream()}
        <VideoStreamsCarousel setStream={setCurrentStream} currentStream={currentStream} />
      </div>
      <CallControlsWrapper>
        <div style={{ width: "100%" }}>
          <span style={{ float: "right" }}></span>
        </div>
        <CallControls />
        <VolumeSlider />
      </CallControlsWrapper>
    </CallBodyWrapper>
  );
};

export default CallBody;
