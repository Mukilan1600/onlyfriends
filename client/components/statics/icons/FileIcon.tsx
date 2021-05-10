import React from "react";

interface FileIconProps {
  fill: string;
}

const FileIcon: React.FC<FileIconProps> = ({ fill }) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6V30C6 30.7956 6.31607 31.5587 6.87868 32.1213C7.44129 32.6839 8.20435 33 9 33H27C27.7956 33 28.5587 32.6839 29.1213 32.1213C29.6839 31.5587 30 30.7956 30 30V12.513C30 12.1133 29.92 11.7177 29.765 11.3494C29.6099 10.981 29.3828 10.6474 29.097 10.368L22.437 3.855C21.8765 3.30699 21.1239 3.0001 20.34 3H9C8.20435 3 7.44129 3.31607 6.87868 3.87868C6.31607 4.44129 6 5.20435 6 6V6Z"
        stroke={fill}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.5 19.5H22.5"
        stroke={fill}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13.5 25.5H18"
        stroke={fill}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21 3V9C21 9.79565 21.3161 10.5587 21.8787 11.1213C22.4413 11.6839 23.2044 12 24 12H30"
        stroke={fill}
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default FileIcon;
