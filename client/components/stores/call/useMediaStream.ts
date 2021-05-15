import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { toast } from "react-toastify";
import useMediaConfigurations, {
  IMediaConfigurations,
} from "./useMediaConfiguration";

interface IUseMediaStreamState extends State {
  mediaStream: MediaStream;
  setMediaStream: (mediaStream: MediaStream) => void;
}

export const useMediaStreamState = create<IUseMediaStreamState>(
  combine({ mediaStream: null }, (set) => ({
    setMediaStream: (mediaStream: MediaStream) => set({ mediaStream }),
  }))
);

const useMediaStream = () => {
  const { mediaStream, setMediaStream } = useMediaStreamState();
  const { setAudioEnabled, setVideoEnabled, ...mediaConfigState } =
    useMediaConfigurations();

  const checkDevicesExist = async (video: boolean, audio: boolean) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      let hasVideo = false,
        hasAudio = false;
      devices.forEach((device) => {
        if (device.kind === "audioinput") hasAudio = true;
        if (device.kind === "videoinput") hasVideo = true;
      });
      const correctedConfig = {
        videoEnabled: hasVideo && video,
        audioEnabled: hasAudio && audio,
      };
      if (video && !hasVideo) toast("No camera found", { type: "error" });
      if (audio && !hasAudio) toast("No Mic found", { type: "error" });
      return correctedConfig;
    } catch (error) {
      console.error(error);
    }
  };

  const getMediaStream = async (mediaConfigurations?: IMediaConfigurations) => {
    try {
      let newMediaConfigurations = {
        ...mediaConfigState,
        ...mediaConfigurations,
      };
      newMediaConfigurations = {
        ...newMediaConfigurations,
        ...(await checkDevicesExist(
          newMediaConfigurations.videoEnabled,
          newMediaConfigurations.audioEnabled
        )),
      };
      if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: newMediaConfigurations.videoEnabled,
        audio: newMediaConfigurations.audioEnabled,
      });
      setMediaStream(stream);
      navigator.mediaDevices.ondevicechange = () => getMediaStream();
      return stream;
    } catch (error) {
      console.error(error);
    }
  };

  return { mediaStream, getMediaStream, setMediaStream };
};

export default useMediaStream;
