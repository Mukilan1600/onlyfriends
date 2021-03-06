import React from "react";
import styled, { keyframes } from "styled-components";

const LoaderAnimation = keyframes`
  0%{ opacity: 100%; }
  100%{ opacity: 20%; }

`;

const ButtonWrapper = styled.button`
  width: 22%;
  height: 36px;
  background: ${(props: { loading: boolean }) =>
    !props.loading
      ? "linear-gradient(94.34deg,#3d98e7 -25.12%,rgba(255, 0, 199, 0.71) 158.36%)"
      : "linear-gradient(94.06deg, #DAEEFF 10.41%, #DAEEFF 10.41%, #DAEEFF 10.42%, rgba(255, 218, 247, 0.71) 157.89%) !important"};
  border-width: 1px;
  border-color: #3d98e7;
  border-radius: 19px;
  cursor: ${(props: { loading: boolean }) => props.loading?'not-allowed':'pointer'};
  font-family: Raleway;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  outline: none;

  color: #ffffff;

  &:not(:active):hover {
    background: linear-gradient(
      94.06deg,
      #7ac1ff 10.41%,
      rgba(255, 92, 219, 0.71) 157.89%
    );
  }
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

interface ButtonProps {
  label: string;
  loading?: boolean;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<ButtonProps> = React.forwardRef<HTMLButtonElement,ButtonProps>(
  ({ label, ...props }, ref) => {
    return (
      <ButtonWrapper {...props} loading={props.loading} ref={ref} disabled={props.loading}>
        {props.loading ? (
          <LoaderDiv>
            <div />
            <div />
            <div />
          </LoaderDiv>
        ) : (
          label
        )}
      </ButtonWrapper>
    );
  }
);

export default Button;
