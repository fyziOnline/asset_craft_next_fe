import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'off-white-primary':'#EEEEEE', // ref : this is the background color used in header and footer
        'custom-light-blue': 'rgba(149, 206, 255, 0.32)',
        'custom-light-red': 'rgba(255, 71, 71, 0.32)',
        'gray-300': '#B1B1B1', // Custom gray color
        'green-100': '#00A881', // Custom light green color
        'green-300': '#01A982', // Custom green color for button text/icon/background
        'green-500': '#1CD3A8', // Another green color for contrast if needed
        'primary-black':'#020103', // black color, ref: navbar background
        'steel-gray': '#ADB3CC', // blue tint with gray, ref: navigation option color
        'steel-gray-shade': '#55597D', // blue tint with gray, ref: navigation option color
        'faded-grey':'#475467',
        'grey-800':'#444444',
        'grey-500' : '#6F6F6F',
        'grey-300' : '#7F7F7F',
        'grey-700' : '#62697626', // ref : non selected portion of range slider
        'crystal-blue-500':'#5DB9FF',
        'crystal-blue-200':'#EBF6FF'
      },
      boxShadow: {
        'dropdown-shadow': '0px 4px 14px 0px rgba(0, 0, 0, 0.10)',
        'search-box-shadow': '0px 2.106px 1.053px 0px rgba(0, 0, 0, 0.10);',
        'rage-thumb-shadow': '0 0 2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    function ({ addComponents } : PluginAPI) {
      addComponents({
        '.custom-range': {
          '&::-webkit-slider-thumb': {
            width: '1.7rem',
            height: '1.7rem',
            backgroundColor: '#00A881',
            border: '4px solid white',
            borderRadius: '9999px',
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            cursor: 'pointer',
            '-webkit-appearance': 'none',
            'z-index': '99',
          },
          '&::-moz-range-thumb': {
            width: '1.7rem',
            height: '1.7rem',
            backgroundColor: '#00A881',
            border: '4px solid white',
            borderRadius: '9999px',
            boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            cursor: 'pointer',
            'z-index': '99',
          },
        },
      });
    },
  ],
};
export default config;



