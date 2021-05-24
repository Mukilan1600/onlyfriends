import React, { useContext } from "react";
import styled from "styled-components";
import { usePeerCallState } from "../../../providers/PeerCallWrapper";
import VolumeFull from "../../../statics/icons/VolumeFull";
import VolumeNone from "../../../statics/icons/VolumeNone";
import VolumePartial from "../../../statics/icons/VolumePartial";
import useMediaConfigurations from "../../../stores/call/useMediaConfiguration";

export const VolumeSliderWrapper = styled.div`
  opacity: 0;
  width: 100%;
  display: flex;
  margin: 0px 15px;
  transition: opacity 0.1s ease-in;

  input {
    width: 0;
    transition: width 0.1s ease-in;
  }
`;

const VolumeSlider: React.FC = () => {
  const { volume, setVolume } = useMediaConfigurations();
  const { callStatus } = usePeerCallState();

  const getVolumeIcon = () => {
    if (volume >= 50) {
      return <VolumeFull />;
    } else if (volume > 0) {
      return <VolumePartial />;
    } else {
      return <VolumeNone />;
    }
  };

  return (
    <VolumeSliderWrapper className="volume-slider">
      {callStatus === "call" && (
        <>
          <div style={{ width: "20px", height: "20px" }}>{getVolumeIcon()}</div>
          <input type="range" min="0" max="100" value={volume} onInput={(e) => setVolume(parseInt(e.currentTarget.value))} />
        </>
      )}
    </VolumeSliderWrapper>
  );
};

export default VolumeSlider;
