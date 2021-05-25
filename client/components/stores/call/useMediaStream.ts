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
  const { setAvailableDevices, setCurrentAudioDevice, setCurrentVideoDevice, setAvailableAudioDevices, setAvailableVideoDevices } =
    useMediaConfigurations();

  const endMediaStream = () => {
    const { mediaStream } = useMediaStreamState.getState();
    if (mediaStream)
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    setMediaStream(null);
  };

  const asyncEndDisplayMediaStream = () => {
    const { displayMediaStream, setDisplayMediaStream } = useMediaStreamState.getState();
    if (displayMediaStream) {
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

  const updateDevicesList = async () => {
    const { audioDevice, videoDevice } = useMediaConfigurations.getState();
    let newAudioDevices: MediaDeviceInfo[] = [],
      newVideoDevices: MediaDeviceInfo[] = [];
    const devices = await navigator.mediaDevices.enumerateDevices();
    let hasCurrentAudio = false,
      hasCurrentVideo = false;
    devices.forEach((device) => {
      if (device.kind === "audioinput") {
        newAudioDevices.push(device);
        if (device.deviceId === audioDevice) {
          hasCurrentAudio = true;
        }
      } else if (device.kind === "videoinput") {
        newVideoDevices.push(device);
        if (device.deviceId === videoDevice) {
          hasCurrentVideo = true;
        }
      }
    });

    if (!hasCurrentAudio) setCurrentAudioDevice("default");
    if (!hasCurrentVideo) setCurrentVideoDevice("default");
    setAvailableAudioDevices(newAudioDevices);
    setAvailableVideoDevices(newVideoDevices);
  };

  const onMediaDeviceChange = async () => {
    const { peer, setUserState, userState, callStatus } = usePeerCallState.getState();
    if (callStatus !== "call_outgoing" && callStatus !== "call") return;
    const { mediaStream } = useMediaStreamState.getState();
    const { audioDevice, videoDevice } = useMediaConfigurations.getState();
    try {
      let newMediaConfigurations = await checkDevicesExist(true, true);
      setUserState({
        muted: userState.muted || !newMediaConfigurations.audioEnabled,
        video: userState.video && newMediaConfigurations.videoEnabled,
        deafened: userState.deafened,
        sharingScreen: userState.sharingScreen,
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: newMediaConfigurations.videoEnabled
          ? {
              deviceId: videoDevice,
            }
          : false,
        audio: newMediaConfigurations.audioEnabled ? { deviceId: audioDevice } : false,
      });

      // @ts-ignore
      if (peer && peer.streams[0]) {
        if (mediaStream) {
          // @ts-ignore
          let mediaStreamTracks: MediaStreamTrack[] = peer.streams[0].getAudioTracks(),
            streamTracks = stream.getAudioTracks();
          if (streamTracks.length > 0) {
            if (mediaStreamTracks.length > 0) {
              // @ts-ignore
              peer.replaceTrack(mediaStreamTracks[0], streamTracks[0], peer.streams[0]);
              mediaStream.getAudioTracks().forEach(track => track.stop());
            } else {
              // @ts-ignore
              peer.addTrack(streamTracks[0], peer.streams[0]);
            }
          }
          // @ts-ignore
          mediaStreamTracks = peer.streams[0].getVideoTracks();
          streamTracks = stream.getVideoTracks();
          if (streamTracks.length > 0) {
            if (mediaStreamTracks.length > 0) {
              // @ts-ignore
              peer.replaceTrack(mediaStreamTracks[0], streamTracks[0], peer.streams[0]);
              mediaStream.getVideoTracks().forEach(track => track.stop());
            } else {
              // @ts-ignore
              peer.addTrack(streamTracks[0], peer.streams[0]);
            }
          }
        } else {
          peer.addStream(stream);
        }
        setMediaStream(stream);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const waitForMediaStream = async (video: boolean, audio: boolean) => {
    try {
      const { audioDevice, videoDevice } = useMediaConfigurations.getState();
      updateDevicesList();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video ? { deviceId: videoDevice } : false,
        audio: audio ? { deviceId: audioDevice } : false,
      });
      setMediaStream(stream);
      navigator.mediaDevices.ondevicechange = updateDevicesList;
      return stream;
    } catch (error) {
      console.error(error);
      onMediaDeviceChange();
    }
  };

  const waitForDisplayMediaStream = async () => {
    try {
      // @ts-ignore
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
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
    onMediaDeviceChange,
  };
};

export default useMediaStream;
