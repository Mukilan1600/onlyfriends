import React, { useEffect } from "react";
import styled from "styled-components";
import { usePeerCallState } from "../../../providers/PeerCallWrapper";
import StatusDeafenedIcon from "../../../statics/icons/StatusDeafenedIcon";
import StatusMutedIcon from "../../../statics/icons/StatusMutedIcon";
import useMediaStream from "../../../stores/call/useMediaStream";
import useProfile from "../../../stores/useProfile";
import { CurrentStream } from "../CallBody";
import VideoPreview from "./VideoPreview";

interface VideoStreamsCarouselProps {
  setStream: (stream: CurrentStream) => void;
  currentStream: CurrentStream;
}

const VIDEO_WIDTH = "156px",
  VIDEO_HEIGHT = "114px";

const StreamsWrapper = styled.div`
  height: 70vh;
  max-height: 70vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0px 40px;
`;

export const StreamHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StreamTitle = styled.div`
  max-width: 116px;
  font-size: 18px;
  line-height: 21px;
  color: #000000;
  margin: 20px 0px;
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
`;

const VideoStreamsCarousel: React.FC<VideoStreamsCarouselProps> = ({ currentStream, setStream }) => {
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { mediaStream, displayMediaStream } = useMediaStream();

  useEffect(() => {
    if (!callState.userState.sharingScreen && currentStream === "user-screen") setStream("receiver-video");
    if (!callState.receiverState.sharingScreen && currentStream === "receiver-screen") setStream("receiver-video");
  }, [callState.userState, callState.receiverState]);

  return (
    <StreamsWrapper>
      {callState.receiverState.sharingScreen && (
        <StreamHolder onClick={setStream.bind(this, "receiver-screen")}>
          <div style={{ cursor: "pointer" }}>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream[1]}
              enabled={callState.receiverState.sharingScreen}
              muted={callState.userState.deafened}
            />
          </div>
          <StreamTitle>{callState.receiverProfile.name}</StreamTitle>
        </StreamHolder>
      )}
      <StreamHolder onClick={setStream.bind(this, "receiver-video")}>
        <div style={{ cursor: "pointer" }}>
          <VideoPreview
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            avatarUrl={callState.receiverProfile.avatarUrl}
            video={callState.receiverStream[0]}
            enabled={callState.receiverState.video}
            muted={callState.userState.deafened}
          />
        </div>
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
      <StreamHolder onClick={setStream.bind(this, "user-video")}>
        <div style={{ cursor: "pointer" }}>
          <VideoPreview
            width={VIDEO_WIDTH}
            height={VIDEO_HEIGHT}
            avatarUrl={user.avatarUrl}
            muted={true}
            video={mediaStream}
            enabled={true}
          />
        </div>
        <StreamTitle>{user.name}</StreamTitle>
      </StreamHolder>
      {callState.userState.sharingScreen && (
        <StreamHolder onClick={setStream.bind(this, "user-screen")}>
          <div style={{ cursor: "pointer" }}>
            <VideoPreview
              width={VIDEO_WIDTH}
              height={VIDEO_HEIGHT}
              avatarUrl={user.avatarUrl}
              video={displayMediaStream}
              enabled={callState.userState.sharingScreen}
              muted={true}
            />
          </div>
          <StreamTitle>{user.name}</StreamTitle>
        </StreamHolder>
      )}
    </StreamsWrapper>
  );
};

export default VideoStreamsCarousel;
