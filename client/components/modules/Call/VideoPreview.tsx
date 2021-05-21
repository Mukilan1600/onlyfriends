import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import hark from "hark";

interface VideoPreviewProps {
  video?: MediaStream;
  avatarUrl: string;
  muted?: boolean;
  enabled?: boolean;
}

const VideoTemplate = styled.div`
  max-height: 130px;
  max-width: 160px;
  height: 130px;
  width: 160px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px;
`;

const ProfileImage = styled.img<{ glow: boolean }>`
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ glow }) => (glow ? "#08a30d" : "transparent")};
`;

const VideoPreview: React.FC<VideoPreviewProps> = ({ video, avatarUrl, muted, enabled }) => {
  const videoRef = useRef<HTMLVideoElement>();
  const audioRef = useRef<HTMLAudioElement>();
  const [speaking, setSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (!video) return;
    const audioEvents = hark(video);

    audioEvents.on("speaking", () => {
      setSpeaking(true);
    });

    audioEvents.on("stopped_speaking", () => {
      setSpeaking(false);
    });

    return () => {
      if (audioEvents) {
        audioEvents.stop();
      }
    };
  }, [video]);

  useEffect(() => {
    if (video && videoRef.current) {
      videoRef.current.muted = muted;
      videoRef.current.srcObject = video;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = video;
      audioRef.current.muted = muted;
    }
  }, [video, videoRef.current, audioRef.current, muted]);
  return (
    <>
      {video && video.getVideoTracks().length > 0 && enabled ? (
        <VideoTemplate>
          <video ref={videoRef} height="130px" width="160px" autoPlay muted />
        </VideoTemplate>
      ) : (
        <VideoTemplate>
          <ProfileImage src={avatarUrl} height="35px" width="35px" alt="call thumbmail" glow={speaking} />
        </VideoTemplate>
      )}
      <audio ref={audioRef} autoPlay />
    </>
  );
};

export default VideoPreview;
