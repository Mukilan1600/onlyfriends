import { useEffect, useState } from "react";
import useMediaConfigurations from "./useMediaConfiguration";



const useMediaStream = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>(null);
  const { videoEnabled, audioEnabled } = useMediaConfigurations();

  const getMediaStream = async () => {
    try {
      if (mediaStream) mediaStream.removeTrack;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      });
      setMediaStream(stream);
    } catch (error) {
      console.log(error);
    }
  };

  return { mediaStream, getMediaStream };
};

export default useMediaStream;
