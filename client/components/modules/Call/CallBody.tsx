import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { usePeerCallState } from "../../providers/PeerCallWrapper";
import StatusDeafenedIcon from "../../statics/icons/StatusDeafenedIcon";
import StatusMutedIcon from "../../statics/icons/StatusMutedIcon";
import useMediaStream from "../../stores/call/useMediaStream";
import useProfile from "../../stores/useProfile";
import CallControls from "./components/CallControls";
import VideoPreview from "./components/VideoPreview";
import VolumeSlider from "./components/VolumeSlider";

const CallBodyWrapper = styled.div`
  padding: 30px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoStreamWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const CallControlsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const CallBody: React.FC = () => {
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { mediaStream } = useMediaStream();

  return (
    <CallBodyWrapper>
      <VideoStreamWrapper>
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <VideoPreview width={525} height={375} avatarUrl={user.avatarUrl} muted={true} video={mediaStream} enabled={callState.userState.video} />
          <p
            style={{
              fontSize: "18px",
              lineHeight: "21px",
              color: "#000000",
              margin: "20px 0px",
            }}
          >
            {user.name}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
          <VideoPreview
            width={525}
            height={375}
            avatarUrl={callState.receiverProfile.avatarUrl}
            video={callState.receiverStream}
            enabled={callState.receiverState.video}
            muted={callState.userState.deafened}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "21px",
                color: "#000000",
                margin: "20px 0px",
              }}
            >
              {callState.receiverProfile.name}
            </p>
            {callState.receiverState.deafened ? (
              <StatusDeafenedIcon />
            ) : callState.receiverState.muted ? (
              <StatusMutedIcon />
            ) : (
              <span style={{ width: "25px", height: "25px", margin: "0px 8px" }} />
            )}
          </div>
        </div>
      </VideoStreamWrapper>
      <CallControlsWrapper>
        <div style={{ width: "100%" }}>
          <span style={{ float: "right" }}></span>
        </div>
        <CallControls />
        <VolumeSlider />
      </CallControlsWrapper>
    </CallBodyWrapper>
  );
};

export default CallBody;
