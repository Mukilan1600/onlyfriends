import React from "react";
import VolumeFull from "../../../statics/icons/VolumeFull";
import VolumeNone from "../../../statics/icons/VolumeNone";
import VolumePartial from "../../../statics/icons/VolumePartial";
import useMediaConfigurations from "../../../stores/call/useMediaConfiguration";

const VolumeSlider = () => {
  const { volume, setVolume } = useMediaConfigurations();

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
    <div style={{ display: "flex", margin: "0px 15px", width: "100%" }}>
      <div style={{ width: "20px", height: "20px" }}>{getVolumeIcon()}</div>
      <input type="range" min="0" max="100" value={volume} onInput={(e) => setVolume(parseInt(e.currentTarget.value))} />
    </div>
  );
};

export default VolumeSlider;
