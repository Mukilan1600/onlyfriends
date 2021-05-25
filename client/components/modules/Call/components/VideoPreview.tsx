import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import hark from "hark";
import useMediaConfigurations from "../../../stores/call/useMediaConfiguration";

export interface VideoPreviewProps {
  video?: MediaStream;
  avatarUrl: string;
  muted?: boolean;
  enabled?: boolean;
  width: string;
  height: string;
}

const VideoTemplate = styled.div<{ width: string; height: string }>`
  max-height: ${({ height }) => `${height}`};
  max-width: ${({ width }) => `${width}`};
  height: ${({ height }) => `${height}`};
  width: ${({ width }) => `${width}`};
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1px;
`;

const ProfileImage = styled.img<{ glow: boolean }>`
  user-select: none;
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: ${({ glow }) => (glow ? "#08a30d" : "transparent")};
`;

const VideoPreview: React.FC<VideoPreviewProps> = ({ video, avatarUrl, muted, enabled, width, height }) => {
  const videoRef = useRef<HTMLVideoElement>();
  const audioRef = useRef<HTMLAudioElement>();
  const [speaking, setSpeaking] = useState<boolean>(false);
  const { volume } = useMediaConfigurations();

  useEffect(() => {
    if (!video || video.getAudioTracks().length < 1) return;
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
      videoRef.current.srcObject = video;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = video;
    }
  }, [video, videoRef.current, audioRef.current]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  return (
    <>
      {video && video.getVideoTracks().length > 0 && enabled ? (
        <VideoTemplate width={width} height={height}>
          <video ref={videoRef} height="100%" width="100%" autoPlay muted />
        </VideoTemplate>
      ) : (
        <VideoTemplate width={width} height={height}>
          <ProfileImage src={avatarUrl} height="25%" alt="call thumbmail" glow={speaking} />
        </VideoTemplate>
      )}
      <audio ref={audioRef} autoPlay />
    </>
  );
};

export default VideoPreview;
