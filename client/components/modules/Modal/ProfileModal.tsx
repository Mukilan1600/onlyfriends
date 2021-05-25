import React, { useRef } from "react";
import styled from "styled-components";
import useOnClickOutside from "../../stores/useOnClickOutside";

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
  onClose: () => void;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, open, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(modalRef, onClose);
  if (!open) return null;
  return <ModalWrapper ref={modalRef}>{children}</ModalWrapper>;
};

export default ProfileModal;
