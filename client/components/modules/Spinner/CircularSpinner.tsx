import React from "react";
import styled, { keyframes } from "styled-components";

const loadAnim = keyframes`
     0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  &,
  &::after {
    border-radius: 50%;
    width: 7em;
    height: 7em;
  }

  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.6em solid rgba(0, 0, 0, 0.2);
  border-right: 0.6em solid rgba(0, 0, 0, 0.2);
  border-bottom: 0.6em solid rgba(0, 0, 0, 0.2);
  border-left: 0.6em solid #000;
  transform: translateZ(0);
  animation: ${loadAnim} 1.1s infinite linear;
`;

const CircularSpinner = () => {
  return <Loader />;
};

export default CircularSpinner;
