import { FC } from "react";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color: string;
  text ?:string
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
        viewBox={`0 0 ${width * 1.55} ${height * 1.55}`}
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


  export const CloseIcon:FC<IconProps> = ({
    width = 25,
    height = 25,
    className = '',
    color = 'black'
  }) => {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 25 25"
        className={className} 
        aria-label="close icon"
        role="img"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="close-icon">
          <path 
            id="Vector" 
            d="M18.8428 6.97705L6.84277 18.9771" 
            stroke={color}
            strokeWidth="2" 
            stroke-linecap="round" 
            strokeLinejoin="round"/>
          <path 
            id="Vector_2" 
            d="M6.84277 6.97705L18.8428 18.9771" 
            stroke={color}
            strokeWidth="2" 
            stroke-linecap="round" 
            strokeLinejoin="round"/>
        </g>
      </svg>
    );
  }



  export const FileIcon:FC<IconProps> = ({
    width = 40, // 154
    height = 49, // 173
    className = '',
    color = '#fff',
    text = ""
  }) => {
    return (
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 154 173"
        className={className} 
        aria-label="file icon"
        role="img"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <g id="file-icon">
          <path 
            id="rect-file" 
            d="M19 22C19 13.1634 26.1634 6 35 6H99C121.644 6 140 24.3563 140 47V148C140 156.837 132.837 164 124 164H35C26.1634 164 19 156.837 19 148V22Z" 
            fill={color}
          />
          <path 
            id="rect-fold" 
            d="M101 6C122.539 6 140 23.4609 140 45H101V6Z" 
            fill="#D0D0D0"
          />
          <rect 
            id="rect-band" 
            x="18" 
            y="68" 
            width="122" 
            height="33" 
            fill="#00A881"
          />
          <path 
            id="rect-out" 
            d="M19 68H14C10.134 68 7 71.134 7 75V108C7 111.866 10.134 115 14 115H19V68Z" 
            fill="#00A881"/>
          <path 
            id="rect-band-fold" 
            d="M7 108C7 104.134 10.134 101 14 101H19V115H14C10.134 115 7 111.866 7 108Z" 
            fill="#097E62"/>
            <text 
              x="54" 
              y="86"
              fontSize="20" 
              fontWeight="500"
              fill="white" 
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {text}
            </text>
          {/* <path 
            id="file-type" 
            d="M31.2642 96V81.4545H37.0028C38.1061 81.4545 39.0459 81.6652 39.8224 82.0866C40.599 82.5033 41.1908 83.0833 41.598 83.8267C42.0099 84.5653 42.2159 85.4176 42.2159 86.3835C42.2159 87.3494 42.0076 88.2017 41.5909 88.9403C41.1742 89.679 40.5705 90.2543 39.7798 90.6662C38.9938 91.0781 38.0421 91.2841 36.9247 91.2841H33.267V88.8196H36.4276C37.0194 88.8196 37.5071 88.7178 37.8906 88.5142C38.2789 88.3059 38.5677 88.0194 38.7571 87.6548C38.9512 87.2855 39.0483 86.8617 39.0483 86.3835C39.0483 85.9006 38.9512 85.4792 38.7571 85.1193C38.5677 84.7547 38.2789 84.473 37.8906 84.2741C37.5024 84.0705 37.0099 83.9688 36.4134 83.9688H34.3395V96H31.2642ZM56.3796 81.4545V96H53.7234L47.3952 86.8452H47.2887V96H44.2134V81.4545H46.9123L53.1907 90.6023H53.3185V81.4545H56.3796ZM68.5653 86.1562C68.4659 85.8106 68.3262 85.5052 68.1463 85.2401C67.9664 84.9702 67.7462 84.7429 67.4858 84.5582C67.2301 84.3688 66.9366 84.2244 66.6051 84.125C66.2784 84.0256 65.9162 83.9759 65.5185 83.9759C64.7751 83.9759 64.1217 84.1605 63.5582 84.5298C62.9995 84.8991 62.5639 85.4366 62.2514 86.142C61.9389 86.8428 61.7827 87.6998 61.7827 88.7131C61.7827 89.7263 61.9366 90.5881 62.2443 91.2983C62.5521 92.0085 62.9877 92.5507 63.5511 92.9247C64.1146 93.294 64.7798 93.4787 65.5469 93.4787C66.2429 93.4787 66.8371 93.3556 67.3295 93.1094C67.8267 92.8584 68.2055 92.5057 68.4659 92.0511C68.7311 91.5966 68.8636 91.0592 68.8636 90.4389L69.4886 90.5312H65.7386V88.2159H71.8253V90.0483C71.8253 91.3267 71.5554 92.4252 71.0156 93.3438C70.4759 94.2576 69.7325 94.9631 68.7855 95.4602C67.8385 95.9527 66.7543 96.1989 65.5327 96.1989C64.169 96.1989 62.9711 95.8982 61.9389 95.2969C60.9067 94.6908 60.1018 93.8314 59.5241 92.7188C58.9512 91.6013 58.6648 90.2756 58.6648 88.7415C58.6648 87.5625 58.8352 86.5114 59.1761 85.5881C59.5218 84.66 60.0047 83.8741 60.625 83.2301C61.2453 82.5862 61.9673 82.0961 62.7912 81.7599C63.6151 81.4238 64.5076 81.2557 65.4688 81.2557C66.2926 81.2557 67.0597 81.3764 67.7699 81.6179C68.4801 81.8546 69.1098 82.1908 69.6591 82.6264C70.2131 83.062 70.6652 83.5805 71.0156 84.1818C71.366 84.7784 71.5909 85.4366 71.6903 86.1562H68.5653Z" 
            fill={color}/> */}
        </g>
      </svg>
    );
  }