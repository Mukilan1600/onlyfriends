import create, { State } from "zustand";
import { combine, devtools } from "zustand/middleware";

export interface IMediaConfigurations {
  hasVideo: boolean;
  hasAudio: boolean;
}

interface useMediaConfigurationsState extends State, IMediaConfigurations {
  setAvailableDevices: (hasVideo: boolean, hasAudio: boolean) => void;
}

const useMediaConfigurations = create<useMediaConfigurationsState>(
  combine({ hasVideo: false, hasAudio: true }, (set) => ({
    setAvailableDevices: (hasVideo: boolean, hasAudio: boolean) => set({ hasAudio, hasVideo }),
  }))
);

export default useMediaConfigurations;
