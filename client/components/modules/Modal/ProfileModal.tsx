import React from "react";
import styled from "styled-components";

const ModalWrapper = styled.div`
  z-index: 10;
  position: absolute;
  right: 39px;
  top: 70px;
  height: 320px;
  width: 300px;
  background: #ffffff;
  box-shadow: 0px 4px 48px -16px rgba(0, 0, 0, 0.25);
`;
type ProfileModalProps = {
  open: boolean;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ open, children }) => {
  if (!open) return null;
  return <ModalWrapper>{children}</ModalWrapper>;
};

export default ProfileModal;
