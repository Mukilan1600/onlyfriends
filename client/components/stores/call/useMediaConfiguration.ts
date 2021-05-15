import create, { State } from "zustand";
import { combine } from "zustand/middleware";

export interface IMediaConfigurations {
  videoEnabled: boolean;
  audioEnabled: boolean;
}

interface useMediaConfigurationsState extends State, IMediaConfigurations {
  setVideoEnabled: (videoEnabled: boolean) => void;
  setAudioEnabled: (audioEnabled: boolean) => void;
}

const useMediaConfigurations = create<useMediaConfigurationsState>(
  combine({ videoEnabled: false, audioEnabled: true }, (set) => ({
    setVideoEnabled: (videoEnabled: boolean) => set({ videoEnabled }),
    setAudioEnabled: (audioEnabled: boolean) => set({ audioEnabled }),
  }))
);

export default useMediaConfigurations;
