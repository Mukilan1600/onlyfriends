import React, { RefObject, useEffect } from "react";
import { usePeerCallState } from "../../providers/PeerCallWrapper";

const useCallSounds = (audioRef: RefObject<HTMLAudioElement>) => {
  const RINGTONE_URL = "/sounds/ringtone.mp3";
  const TOGGLE_ON_URL = "/sounds/toggleon.mp3"
  const TOGGLE_OFF_URL = "/sounds/toggleoff.wav"
  const { callStatus, userState } = usePeerCallState();
  useEffect(() => {
    if (!audioRef.current) return;
    if (callStatus === "call_incoming") {
      audioRef.current.src = RINGTONE_URL;
      audioRef.current.loop = true;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [callStatus, audioRef]);

  const playToggleOn = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = false;
    audioRef.current.src = TOGGLE_ON_URL;
    audioRef.current.play();
  }

  const playToggleOff = () => {
    if (!audioRef.current) return;
    audioRef.current.loop = false;
    audioRef.current.src = TOGGLE_OFF_URL;
    audioRef.current.play();
  }

  return {playToggleOn, playToggleOff}
};

export default useCallSounds;
