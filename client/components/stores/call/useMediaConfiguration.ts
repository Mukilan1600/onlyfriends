import create, { State } from "zustand";
import { combine, devtools } from "zustand/middleware";

export interface IMediaConfigurations {
  availableVideoDevices: MediaDeviceInfo[];
  availableAudioDevices: MediaDeviceInfo[];
  videoDevice: string;
  audioDevice: string;
  hasVideo: boolean;
  hasAudio: boolean;
  volume: number;
}

interface useMediaConfigurationsState extends State, IMediaConfigurations {
  setAvailableVideoDevices: (devices: MediaDeviceInfo[]) => void;
  setAvailableAudioDevices: (devices: MediaDeviceInfo[]) => void;
  setCurrentVideoDevice: (deviceId: string) => void;
  setCurrentAudioDevice: (deviceId: string) => void;
  setAvailableDevices: (hasVideo: boolean, hasAudio: boolean) => void;
  setVolume: (volume: number) => void;
}

const useMediaConfigurations = create<useMediaConfigurationsState>(
  combine(
    {
      hasVideo: false,
      hasAudio: true,
      volume: 100,
      videoDevice: "default",
      audioDevice: "default",
      availableAudioDevices: [],
      availableVideoDevices: [],
    },
    (set) => ({
      setAvailableDevices: (hasVideo: boolean, hasAudio: boolean) => set({ hasAudio, hasVideo }),
      setVolume: (volume: number) => set({ volume }),
      setCurrentVideoDevice: (deviceId: string) => set({ videoDevice: deviceId }),
      setCurrentAudioDevice: (deviceId: string) => set({ audioDevice: deviceId }),
      setAvailableVideoDevices: (devices: MediaDeviceInfo[]) => set({ availableVideoDevices: devices }),
      setAvailableAudioDevices: (devices: MediaDeviceInfo[]) => set({ availableAudioDevices: devices }),
    })
  )
);

export default useMediaConfigurations;
