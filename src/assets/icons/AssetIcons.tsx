import { FC } from "react";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color: string;
}

export const MailIcon:FC<IconProps> = ({
    width = 27,
    height = 27,
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

  export const LinkedinIcon:FC<IconProps> = ({
    width = 27,
    height = 27,
    className = '',
    color = 'black'
  }) => {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className={className} 
        aria-label="mail icon"
        role="img"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
          d="M18 9C19.7902 9 21.5071 9.71116 22.773 10.977C24.0388 12.2429 24.75 13.9598 24.75 15.75V23.625H20.25V15.75C20.25 15.1533 20.0129 14.581 19.591 14.159C19.169 13.7371 18.5967 13.5 18 13.5C17.4033 13.5 16.831 13.7371 16.409 14.159C15.9871 14.581 15.75 15.1533 15.75 15.75V23.625H11.25V15.75C11.25 13.9598 11.9612 12.2429 13.227 10.977C14.4929 9.71116 16.2098 9 18 9Z" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" />
        <path 
          d="M6.75 10.125H2.25V23.625H6.75V10.125Z" 
          stroke={color} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" />
        <path 
          d="M4.5 6.75C5.74264 6.75 6.75 5.74264 6.75 4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75Z" 
          stroke={color} 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round" />
      </svg>
    );
  }

  export const SalesCallIcon:FC<IconProps> = ({
    width = 27,
    height = 27,
    className = '',
    color = 'black'
  }) => {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className={className} 
        aria-label="mail icon"
        role="img"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
          d="M24.7501 19.0351V22.4101C24.7514 22.7234 24.6872 23.0335 24.5617 23.3206C24.4362 23.6077 24.2521 23.8654 24.0212 24.0772C23.7903 24.289 23.5178 24.4503 23.221 24.5507C22.9241 24.651 22.6097 24.6883 22.2976 24.6601C18.8358 24.284 15.5105 23.101 12.5889 21.2064C9.87066 19.4791 7.56611 17.1746 5.83886 14.4564C3.93758 11.5215 2.75438 8.17998 2.38511 4.70261C2.35699 4.39151 2.39397 4.07796 2.49367 3.78194C2.59337 3.48591 2.75363 3.21388 2.96422 2.98318C3.17481 2.75248 3.43114 2.56816 3.71687 2.44195C4.00261 2.31574 4.31149 2.2504 4.62386 2.25011H7.99886C8.54483 2.24474 9.07412 2.43807 9.48809 2.79408C9.90206 3.15009 10.1724 3.64449 10.2489 4.18511C10.3913 5.26518 10.6555 6.32568 11.0364 7.34636C11.1877 7.74902 11.2205 8.18664 11.1308 8.60735C11.041 9.02806 10.8326 9.41423 10.5301 9.72011L9.10136 11.1489C10.7029 13.9653 13.0349 16.2974 15.8514 17.8989L17.2801 16.4701C17.586 16.1676 17.9722 15.9592 18.3929 15.8695C18.8136 15.7797 19.2512 15.8125 19.6539 15.9639C20.6745 16.3447 21.735 16.6089 22.8151 16.7514C23.3616 16.8285 23.8607 17.1037 24.2175 17.5248C24.5742 17.9459 24.7638 18.4834 24.7501 19.0351Z" stroke={color}
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"/>
      </svg>
    );
  }

  export const LandingAssetIcon:FC<IconProps> = ({
    width = 27,
    height = 27,
    className = '',
    color = 'black'
  }) => {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        className={className} 
        aria-label="mail icon"
        role="img"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path 
          d="M6.55078 19.8104H5.42578C4.82904 19.8104 4.25675 19.5734 3.83479 19.1514C3.41283 18.7295 3.17578 18.1572 3.17578 17.5604V6.31042C3.17578 5.71369 3.41283 5.14139 3.83479 4.71943C4.25675 4.29748 4.82904 4.06042 5.42578 4.06042H23.4258C24.0225 4.06042 24.5948 4.29748 25.0168 4.71943C25.4387 5.14139 25.6758 5.71369 25.6758 6.31042V17.5604C25.6758 18.1572 25.4387 18.7295 25.0168 19.1514C24.5948 19.5734 24.0225 19.8104 23.4258 19.8104H22.3008"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
        <path 
          d="M14.4258 17.5604L20.0508 24.3104H8.80078L14.4258 17.5604Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
      </svg>
    );
  }

