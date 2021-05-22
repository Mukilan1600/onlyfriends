import create, { State } from "zustand";
import { combine } from "zustand/middleware";
import useMediaConfigurations from "./useMediaConfiguration";
import { usePeerCallState } from "../../providers/PeerCallWrapper";

interface IUseMediaStreamState extends State {
  mediaStream: MediaStream;
  displayMediaStream: MediaStream;
  setMediaStream: (mediaStream: MediaStream) => void;
  setDisplayMediaStream: (displayMediaStream: MediaStream) => void;
}

export const useMediaStreamState = create<IUseMediaStreamState>(
  combine({ mediaStream: null, displayMediaStream: null }, (set) => ({
    setMediaStream: (mediaStream: MediaStream) => set({ mediaStream }),
    setDisplayMediaStream: (displayMediaStream: MediaStream) => set({ displayMediaStream }),
  }))
);

const useMediaStream = () => {
  const { mediaStream, displayMediaStream, setMediaStream, setDisplayMediaStream } = useMediaStreamState();
  const { setAvailableDevices } = useMediaConfigurations();

  const endMediaStream = () => {
    if (mediaStream)
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    setMediaStream(null);
  };

  const asyncEndDisplayMediaStream = () => {
    const { displayMediaStream, setDisplayMediaStream } = useMediaStreamState.getState();
    if (displayMediaStream){
      displayMediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setDisplayMediaStream(null);
  };

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
      setAvailableDevices(hasVideo, hasAudio);
      return correctedConfig;
    } catch (error) {
      console.error(error);
    }
  };

  const onMediaDeviceChange = async () => {
    const { peer, setUserState, userState, callStatus } = usePeerCallState.getState();
    if (callStatus !== "call_outgoing" && callStatus !== "call") return;

    const { mediaStream } = useMediaStreamState.getState();

    try {
      let newMediaConfigurations = await checkDevicesExist(true, true);
      setUserState({
        muted: userState.muted || !newMediaConfigurations.audioEnabled,
        video: userState.video && newMediaConfigurations.videoEnabled,
        deafened: userState.deafened,
        sharingScreen: userState.sharingScreen,
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: newMediaConfigurations.videoEnabled,
        audio: newMediaConfigurations.audioEnabled,
      });

      if (peer) {
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
          });

          mediaStream.getTracks().forEach((track) => {
            exists = false;
            stream.getTracks().forEach((track1) => {
              if (track.id === track1.id) {
                exists = true;
              }
            });
            if (!exists) {
              peer.removeTrack(track, mediaStream);
            }
          });
        } else {
          peer.addStream(stream);
        }
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
      onMediaDeviceChange();
    }
  };

  const waitForDisplayMediaStream = async () => {
    try {
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia();
      setDisplayMediaStream(stream);
      return stream;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    mediaStream,
    displayMediaStream,
    waitForMediaStream,
    setMediaStream,
    checkDevicesExist,
    endMediaStream,
    waitForDisplayMediaStream,
    asyncEndDisplayMediaStream,
  };
};

export default useMediaStream;
