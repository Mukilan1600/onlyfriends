import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useMediaConfigurations from "../../../stores/call/useMediaConfiguration";
import useOnClickOutside from "../../../stores/useOnClickOutside";

const ModalWrapper = styled.div`
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 10px 20px;
  display: flex;
  flex-direction: column;

  div {
    margin: 10px 0px;
    display: flex;
    flex-direction: column;
  }

  select {
    margin: 5px 0px 0px 20px;
  }
`;

const ModalHeader = styled.div`
  height: 50px;
  padding: 10px 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CallSettingsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { audioDevice, videoDevice, setCurrentAudioDevice, setCurrentVideoDevice, availableAudioDevices, availableVideoDevices } =
    useMediaConfigurations();
  const modalRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, onClose);

  if (!open) return null;
  return (
    <ModalWrapper>
      <ModalContent ref={modalRef}>
        <ModalHeader>
          <h3>Media Settings</h3>
          <span style={{ cursor: "pointer", width: "15px", textAlign: "center" }} onClick={onClose}>
            x
          </span>
        </ModalHeader>
        <span style={{ width: "96%", background: "rgba(0,0,0,0.4)", height: "1px" }} />
        <ModalBody>
          <div>
            <label htmlFor="audio-device-selector">Audio device</label>
            <select id="audio-device-selector" value={audioDevice} onChange={(e) => setCurrentAudioDevice(e.target.value)}>
              {availableAudioDevices.map((device) => (
                <option value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="video-device-selector">Video device</label>
            <select
              id="video-device-selector"
              value={videoDevice}
              disabled={availableVideoDevices.length < 1}
              onChange={(e) => setCurrentVideoDevice(e.target.value)}
            >
              {availableVideoDevices.length > 0 ? (
                availableVideoDevices.map((device) => (
                  <option value={device.deviceId} key={device.deviceId}>
                    {device.label}
                  </option>
                ))
              ) : (
                <option>No video device found</option>
              )}
            </select>
          </div>
        </ModalBody>
      </ModalContent>
    </ModalWrapper>
  );
};

export default CallSettingsModal;
