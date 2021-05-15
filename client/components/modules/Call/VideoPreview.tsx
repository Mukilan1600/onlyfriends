import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface VideoPreviewProps {
  video?: MediaStream;
  avatarUrl: string;
  muted?: boolean;
}

const NoVideoTemplate = styled.div`
  height: 100px;
  width: 130px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px;

  img {
    border-radius: 50%;
  }
`;

const VideoPreview: React.FC<VideoPreviewProps> = ({
  video,
  avatarUrl,
  muted,
}) => {
  const videoRef = useRef<HTMLVideoElement>();

  useEffect(() => {
    if (!muted && video) console.log(video.getAudioTracks());
    if (video && video.getVideoTracks().length > 0) {
      videoRef.current.muted = muted;
      videoRef.current.srcObject = video;
      videoRef.current.play();
    }
  }, [video]);

  return video && video.getVideoTracks().length > 0 ? (
    <video ref={videoRef} height="100px" width="130px" autoPlay />
  ) : (
    <NoVideoTemplate>
      <img src={avatarUrl} height="35px" width="35px" alt="call thumbmail" />
    </NoVideoTemplate>
  );
};

export default VideoPreview;
