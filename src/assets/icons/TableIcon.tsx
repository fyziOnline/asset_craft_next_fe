import { FC } from "react";

interface IconProps {
  width?: string;
  height?: string;
  strokeColor?: string;
  strokeWidth?: string;
}


export const EmailIcon: FC<IconProps> = ({ width = "27", height = "27", strokeColor = "black", strokeWidth = "2" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 27 27" fill="none">
      <path d="M4.5 4.5H22.5C23.7375 4.5 24.75 5.5125 24.75 6.75V20.25C24.75 21.4875 23.7375 22.5 22.5 22.5H4.5C3.2625 22.5 2.25 21.4875 2.25 20.25V6.75C2.25 5.5125 3.2625 4.5 4.5 4.5Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.75 6.75L13.5 14.625L2.25 6.75" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const LinkedinIcon: FC<IconProps> = ({ width = "27", height = "27", strokeColor = "black", strokeWidth = "2" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 27 27" fill="none">
      <path d="M18 9C19.7902 9 21.5071 9.71116 22.773 10.977C24.0388 12.2429 24.75 13.9598 24.75 15.75V23.625H20.25V15.75C20.25 15.1533 20.0129 14.581 19.591 14.159C19.169 13.7371 18.5967 13.5 18 13.5C17.4033 13.5 16.831 13.7371 16.409 14.159C15.9871 14.581 15.75 15.1533 15.75 15.75V23.625H11.25V15.75C11.25 13.9598 11.9612 12.2429 13.227 10.977C14.4929 9.71116 16.2098 9 18 9Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.75 10.125H2.25V23.625H6.75V10.125Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 6.75C5.74264 6.75 6.75 5.74264 6.75 4.5C6.75 3.25736 5.74264 2.25 4.5 2.25C3.25736 2.25 2.25 3.25736 2.25 4.5C2.25 5.74264 3.25736 6.75 4.5 6.75Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const SalesCallIcon: FC<IconProps> = ({ width = "27", height = "27", strokeColor = "black", strokeWidth = "2" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 27 27" fill="none">
      <path d="M24.7501 19.0351V22.4101C24.7514 22.7234 24.6872 23.0335 24.5617 23.3206C24.4362 23.6077 24.2521 23.8654 24.0212 24.0772C23.7903 24.289 23.5178 24.4503 23.221 24.5507C22.9241 24.651 22.6097 24.6883 22.2976 24.6601C18.8358 24.284 15.5105 23.101 12.5889 21.2064C9.87066 19.4791 7.56611 17.1746 5.83886 14.4564C3.93758 11.5215 2.75438 8.17998 2.38511 4.70261C2.35699 4.39151 2.39397 4.07796 2.49367 3.78194C2.59337 3.48591 2.75363 3.21388 2.96422 2.98318C3.17481 2.75248 3.43114 2.56816 3.71687 2.44195C4.00261 2.31574 4.31149 2.2504 4.62386 2.25011H7.99886C8.54483 2.24474 9.07412 2.43807 9.48809 2.79408C9.90206 3.15009 10.1724 3.64449 10.2489 4.18511C10.3913 5.26518 10.6555 6.32568 11.0364 7.34636C11.1877 7.74902 11.2205 8.18664 11.1308 8.60735C11.041 9.02806 10.8326 9.41423 10.5301 9.72011L9.10136 11.1489C10.7029 13.9653 13.0349 16.2974 15.8514 17.8989L17.2801 16.4701C17.586 16.1676 17.9722 15.9592 18.3929 15.8695C18.8136 15.7797 19.2512 15.8125 19.6539 15.9639C20.6745 16.3447 21.735 16.6089 22.8151 16.7514C23.3616 16.8285 23.8607 17.1037 24.2175 17.5248C24.5742 17.9459 24.7638 18.4834 24.7501 19.0351Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const LandingAssetIcon: FC<IconProps> = ({ width = "27", height = "27", strokeColor = "black", strokeWidth = "2" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 28 28" fill="none">
      <path d="M6.55078 19.8104H5.42578C4.82904 19.8104 4.25675 19.5734 3.83479 19.1514C3.41283 18.7295 3.17578 18.1572 3.17578 17.5604V6.31042C3.17578 5.71369 3.41283 5.14139 3.83479 4.71943C4.25675 4.29748 4.82904 4.06042 5.42578 4.06042H23.4258C24.0225 4.06042 24.5948 4.29748 25.0168 4.71943C25.4387 5.14139 25.6758 5.71369 25.6758 6.31042V17.5604C25.6758 18.1572 25.4387 18.7295 25.0168 19.1514C24.5948 19.5734 24.0225 19.8104 23.4258 19.8104H22.3008" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.4258 17.5604L20.0508 24.3104H8.80078L14.4258 17.5604Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const LandingAssetIcon2: FC<IconProps> = ({ width = "98", height = "99", strokeColor = "black", strokeWidth = "1.45496" }) => {
  return (
    <svg id="Layer_1" enable-background="new 0 0 512 512" height={height} viewBox="0 0 512 512" width={width} xmlns="http://www.w3.org/2000/svg">
      <path stroke={strokeColor} strokeWidth={strokeWidth} d="m465 14.9h-418c-25.9 0-47 21.1-47 47v388.3c0 25.9 21.1 47 47 47h418c25.9 0 47-21.1 47-47v-388.3c0-25.9-21.1-47-47-47zm-418 24h418c12.7 0 23 10.3 23 23v63.1h-233.9l-44.4-49.5c-2.3-2.5-5.5-4-8.9-4h-176.8v-9.6c0-12.7 10.3-23 23-23zm418 434.2h-418c-12.7 0-23-10.3-23-23v-354.6h171.3l44.4 49.5c2.3 2.5 5.5 4 8.9 4h239.4v301.2c0 12.6-10.3 22.9-23 22.9zm-388.5-109.8h184c6.6 0 12-5.4 12-12v-145c0-6.6-5.4-12-12-12h-184c-6.6 0-12 5.4-12 12v145c0 6.7 5.4 12 12 12zm12-24v-24.5c.4-.3.8-.6 1.1-1l42.9-42.9 42.9 42.9c2.3 2.3 5.4 3.5 8.5 3.5s6.1-1.2 8.5-3.5c4.7-4.7 4.7-12.3 0-17l-7.4-7.4 19.6-19.6 42.9 42.9c.3.3.6.6 1 .9v25.7zm160-121v61.5l-35.4-35.4c-2.3-2.3-5.3-3.5-8.5-3.5s-6.2 1.3-8.5 3.5l-28.1 28.1-27-27c-2.3-2.3-5.3-3.5-8.5-3.5s-6.2 1.3-8.5 3.5l-35.5 35.5v-62.7zm206.5-12c0 6.6-5.4 12-12 12h-116c-6.6 0-12-5.4-12-12s5.4-12 12-12h116c6.6 0 12 5.4 12 12zm0 67.9c0 6.6-5.4 12-12 12h-116c-6.6 0-12-5.4-12-12s5.4-12 12-12h116c6.6 0 12 5.3 12 12zm0 67.8c0 6.6-5.4 12-12 12h-116c-6.6 0-12-5.4-12-12s5.4-12 12-12h116c6.6 0 12 5.4 12 12zm-.5 67.8c0 6.6-5.4 12-12 12h-366c-6.6 0-12-5.4-12-12s5.4-12 12-12h366c6.6 0 12 5.4 12 12zm-164.3-327.9c0-6.6 5.3-12 12-12h.1c6.6 0 12 5.4 12 12s-5.4 12-12 12c-6.7 0-12.1-5.4-12.1-12zm61.8 0c0-6.6 5.3-12 12-12h.1c6.6 0 12 5.4 12 12s-5.4 12-12 12c-6.7 0-12.1-5.4-12.1-12zm61.8 0c0-6.6 5.3-12 12-12h.1c6.6 0 12 5.4 12 12s-5.4 12-12 12c-6.7 0-12.1-5.4-12.1-12z" />
    </svg>

  )
}