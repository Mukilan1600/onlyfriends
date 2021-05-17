import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface VideoPreviewProps {
  video?: MediaStream;
  avatarUrl: string;
  muted?: boolean;
  enabled?: boolean;
}

const VideoTemplate = styled.div`
  max-height: 100px;
  max-width: 130px;
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
  enabled,
}) => {
  const videoRef = useRef<HTMLVideoElement>();
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.muted = muted;
      videoRef.current.srcObject = video;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = video;
      audioRef.current.muted = muted;
    }
  }, [video, videoRef.current, audioRef.current]);
  return (
    <>
      {video && video.getVideoTracks().length > 0 && enabled ? (
        <VideoTemplate>
          <video ref={videoRef} height="100px" width="130px" autoPlay muted />
        </VideoTemplate>
      ) : (
        <VideoTemplate>
          <img
            src={avatarUrl}
            height="35px"
            width="35px"
            alt="call thumbmail"
          />
        </VideoTemplate>
      )}
      <audio ref={audioRef} autoPlay />
    </>
  );
};

export default VideoPreview;
