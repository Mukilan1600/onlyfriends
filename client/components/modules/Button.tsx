import React, { ReactHTMLElement, ReactNode, StyleHTMLAttributes } from "react";
import styled from "styled-components";

const ButtonWrapper = styled.button`
  border: none;
  width: 22%;
  height: 36px;
  background: linear-gradient(
    94.34deg,
    #3d98e7 -25.12%,
    rgba(255, 0, 199, 0.71) 158.36%
  );
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

interface ButtonProps {
  label: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<ButtonProps> = ({ label, ...props }) => {
  return <ButtonWrapper {...props}>{label}</ButtonWrapper>;
};

export default Button;
