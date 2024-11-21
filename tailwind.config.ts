import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      aspectRatio:{
        half : "1 / 2"
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'black-translucent': 'rgba(0, 0, 0, 0.54)',
        'off-white-primary':'#EEEEEE', // ref : this is the background color used in header and footer
        'custom-light-blue': 'rgba(149, 206, 255, 0.32)',
        'custom-light-red': 'rgba(255, 71, 71, 0.32)',
        'custom-green-light': 'rgba(0, 168, 129, 0.15)',
        'gray-300': '#B1B1B1', // Custom gray color
        'green-mist':'##00B1882E', // ref : used as bg for status label
        'green-100': '#00A881', // Custom light green color
        'green-300': '#01A982', // Custom green color for button text/icon/background
        'green-500': '#1CD3A8', // Another green color for contrast if needed
        'primary-black':'#020103', // black color, ref: navbar background
        'steel-gray': '#ADB3CC', // blue tint with gray, ref: navigation option color
        'steel-gray-shade': '#55597D', // blue tint with gray, ref: navigation option color
        'faded-grey':'#475467',
        'grey-100': '#F9F9F9',
        'grey-800':'#444444',
        'grey-500' : '#6F6F6F',
        'grey-300' : '#7F7F7F',
        'grey-200' : '#D0D0D0',
        'grey-700' : '#62697626', // ref : non selected portion of range slider
        'crystal-blue-500':'#5DB9FF',
        'crystal-blue-200':'#EBF6FF',
        card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
      },
      boxShadow: {
        'dropdown-shadow': '0px 4px 14px 0px rgba(0, 0, 0, 0.10)',
        'search-box-shadow': '0px 2.106px 1.053px 0px rgba(0, 0, 0, 0.10);',
        'rage-thumb-shadow': '0 0 2px rgba(0, 0, 0, 0.2)',
        'box-green-shadow': '0px 10px 20px 0px rgba(0, 168, 129, 0.50);'
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), require("tailwindcss-animate"),
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



