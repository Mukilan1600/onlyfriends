import create, { State } from "zustand";
import { combine } from "zustand/middleware";

interface useMediaConfigurationsState extends State {
  videoEnabled: boolean;
  audioEnabled: boolean;
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
