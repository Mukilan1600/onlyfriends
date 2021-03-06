import { useRouter } from "next/router";
import React, { useRef } from "react";
import styled from "styled-components";
import { usePeerCallState } from "../../providers/PeerCallWrapper";
import StatusDeafenedIcon from "../../statics/icons/StatusDeafenedIcon";
import StatusMutedIcon from "../../statics/icons/StatusMutedIcon";
import useCallSounds from "../../stores/call/useCallSounds";
import useMediaConfigurations from "../../stores/call/useMediaConfiguration";
import useMediaStream from "../../stores/call/useMediaStream";
import useProfile from "../../stores/useProfile";
import CallControls from "./components/CallControls";
import VideoPreview from "./components/VideoPreview";

const PreviewWrapper = styled.div<{ closed: boolean }>`
  width: 100%;
  min-height: ${({ closed }) => (closed ? "0px" : "267px")};
  transition: min-height 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
`;

const TitleName = styled.span`
  font-family: Raleway;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 21px;
  color: #000;
`;

const CallStatus = styled.div`
  display: flex;
  align-items: center;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 11px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.54);
`;

const CallPreview: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { user } = useProfile();
  const callState = usePeerCallState();
  const { mediaStream } = useMediaStream();
  const router = useRouter();
  const { playToggleOn, playToggleOff } = useCallSounds(audioRef);

  const expandCallPreview = () => {
    router.push("/call");
  };

  const getPreviewStatus = () => {
    switch (callState.callStatus) {
      case "call_outgoing":
        return (
          <>
            <TitleName>{callState.receiverProfile.name}</TitleName> calling...
          </>
        );
      case "call_incoming":
        return (
          <>
            <TitleName>{callState.receiverProfile.name}</TitleName> incoming call...
          </>
        );
      case "call":
        return (
          <>
            In call with <TitleName>{callState.receiverProfile.name}</TitleName>
          </>
        );
      case "rtc_connecting":
        return "RTC connecting...";
    }
  };

  return (
    <PreviewWrapper closed={callState.callStatus === "idle"}>
      {callState.callStatus !== "idle" && (
        <>
          <CallStatus>
            <p>{getPreviewStatus()}</p>
            {callState.receiverState.deafened ? (
              <StatusDeafenedIcon />
            ) : callState.receiverState.muted ? (
              <StatusMutedIcon />
            ) : (
              <span style={{ width: "25px", height: "25px", margin: "0px 8px" }} />
            )}
          </CallStatus>
          <div style={{ display: "flex", cursor: "pointer" }} onClick={expandCallPreview}>
            <VideoPreview
              width="160px"
              height="130px"
              avatarUrl={user.avatarUrl}
              muted={true}
              video={mediaStream}
              enabled={callState.userState.video}
            />
            <VideoPreview
              width="160px"
              height="130px"
              avatarUrl={callState.receiverProfile.avatarUrl}
              video={callState.receiverStream[0]}
              enabled={callState.receiverState.video}
              muted={callState.userState.deafened}
            />
          </div>

          <div style={{ display: "flex" }}>
            <CallControls playToggleOn={playToggleOn} playToggleOff={playToggleOff} />
          </div>
        </>
      )}
      <audio ref={audioRef} />
    </PreviewWrapper>
  );
};

export default CallPreview;
