import React from "react";
import styled, { keyframes } from "styled-components";

const LoaderAnimation = keyframes`
  0%{ opacity: 100%; }
  50%{ opacity: 50%; }
  100%{ opacity: 100%; }

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
  cursor: pointer;

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

  & div {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #a028e9;
    margin: 3px;
    animation-name: ${LoaderAnimation};
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-delay: 0s;
  }

  div:nth-child(2) {
    animation-delay: 0.5s;
  }

  div:nth-child(3) {
    animation-delay: 1s;
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
      <ButtonWrapper {...props} loading={props.loading} ref={ref}>
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
