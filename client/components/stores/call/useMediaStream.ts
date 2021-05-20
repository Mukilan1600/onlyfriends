import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import { toast } from "react-toastify";
import useMediaConfigurations from "./useMediaConfiguration";
import { usePeerCallState } from "../../providers/PeerCallWrapper";

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
  const { setAvailableDevices } = useMediaConfigurations();

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
      // if (video && !hasVideo) toast("No camera found", { type: "error" });
      // if (audio && !hasAudio) toast("No Mic found", { type: "error" });
      setAvailableDevices(hasVideo, hasAudio);
      return correctedConfig;
    } catch (error) {
      console.error(error);
    }
  };

  const onMediaDeviceChange = async () => {
    const { peer, setUserState, userState } = usePeerCallState.getState();
    const { mediaStream } = useMediaStreamState.getState();
    try {
      let newMediaConfigurations = await checkDevicesExist(true, true);
      setUserState({
        muted: userState.muted || !newMediaConfigurations.audioEnabled,
        video: userState.video && newMediaConfigurations.videoEnabled,
        deafened: userState.deafened,
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: newMediaConfigurations.videoEnabled,
        audio: newMediaConfigurations.audioEnabled,
      });
      setMediaStream(stream);

      if (mediaStream) {
        let exists = false;
        stream.getTracks().forEach((track) => {
          mediaStream.getTracks().forEach((track1) => {
            if (track.id === track1.id) {
              peer.replaceTrack(track1, track, mediaStream);
              exists = true;
            }
          });
          if (!exists) {
            peer.addTrack(track, mediaStream);
          }
          console.log(track);
        });
      } else {
        peer.addStream(stream);
      }
      setMediaStream(stream);
    } catch (error) {
      console.error(error);
    }
  };

  const waitForMediaStream = async (video: boolean, audio: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: audio,
      });
      setMediaStream(stream);
      navigator.mediaDevices.ondevicechange = onMediaDeviceChange;
      return stream;
    } catch (error) {
      console.error(error);
    }
  };

  return { mediaStream, waitForMediaStream, setMediaStream, checkDevicesExist };
};

export default useMediaStream;
