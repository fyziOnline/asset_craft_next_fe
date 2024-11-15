import { FC } from "react";

interface icon {
    width?: number | string
    height?: number | string
    className?: string
    color?: string
}

export const MailIcon:FC<icon> = ({
    width = 40,
    height = 40,
    className = '',
    color = 'black'
  }) => {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 44 44"
        className={className} 
        aria-label="mail icon"
        role="img"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
            d="M7.33366 7.33325H36.667C38.6837 7.33325 40.3337 8.98325 40.3337 10.9999V32.9999C40.3337 35.0166 38.6837 36.6666 36.667 36.6666H7.33366C5.31699 36.6666 3.66699 35.0166 3.66699 32.9999V10.9999C3.66699 8.98325 5.31699 7.33325 7.33366 7.33325Z" 
            stroke={color}
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M40.3337 11L22.0003 23.8333L3.66699 11" 
            stroke={color}
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"/>

      </svg>
    );
  };

