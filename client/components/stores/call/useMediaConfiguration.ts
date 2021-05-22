import create, { State } from "zustand";
import { combine, devtools } from "zustand/middleware";

export interface IMediaConfigurations {
  hasVideo: boolean;
  hasAudio: boolean;
  volume: number;
}

interface useMediaConfigurationsState extends State, IMediaConfigurations {
  setAvailableDevices: (hasVideo: boolean, hasAudio: boolean) => void;
  setVolume: (volume: number) => void;
}

const useMediaConfigurations = create<useMediaConfigurationsState>(
  combine({ hasVideo: false, hasAudio: true, volume: 100 }, (set) => ({
    setAvailableDevices: (hasVideo: boolean, hasAudio: boolean) => set({ hasAudio, hasVideo }),
    setVolume: (volume: number) => set({ volume }),
  }))
);

export default useMediaConfigurations;
