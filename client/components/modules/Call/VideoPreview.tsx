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
    if (video) {
      videoRef.current.muted = muted;
      videoRef.current.srcObject = video;
    }
  }, [video]);

  return video ? (
    <video ref={videoRef} />
  ) : (
    <NoVideoTemplate>
      <img src={avatarUrl} height="35px" width="35px" alt="call thumbmail" />
    </NoVideoTemplate>
  );
};

export default VideoPreview;
