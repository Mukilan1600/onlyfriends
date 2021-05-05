import React from "react";
import styled, { keyframes } from "styled-components";

const LoaderAnimation = keyframes`
  0%{ opacity: 100%; }
  100%{ opacity: 20%; }

`;

const LoaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  & div {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    opacity: 20%;
    background-color: #a028e9;
    margin: 3px;
    animation-name: ${LoaderAnimation};
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-delay: 0s;
  }

  div:nth-child(2) {
    animation-delay: 0.1s;
  }

  div:nth-child(3) {
    animation-delay: 0.2s;
  }
`;

const Spinner: React.FC = () => {
  return (
    <LoaderDiv>
      <div />
      <div />
      <div />
    </LoaderDiv>
  );
};

export default Spinner;
