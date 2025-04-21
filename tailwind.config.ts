import type { Config } from "tailwindcss";
import { PluginAPI } from "tailwindcss/types/config";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindScrollbar from "tailwind-scrollbar";
import tailwindcssTypography from "@tailwindcss/typography";



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
       keyframes : {
        hideToolTip : {
          '0%' : {opacity:'1',visibility:'visible'},
          '90%': {opacity :'1',visibility : 'visible'},
          '100%':{opacity:'0',visibility:'hidden'}
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
       },   
       animation : {
        hideTooltip :"hideTooltip 3s forwards",
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.3s ease-out',
        fadeInUp: 'fadeInUp 0.5s ease-out'
       },
      aspectRatio:{
        half : "1 / 2",
        card : "434 / 330",
        new : '345 / 255'
      },
      screens:{
        mlg : '840px',
        // md : '780px'
      },
      margin:{
        'section' : "1.25rem"
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        geist: ['GeistMonoVF', 'monospace'], // Add fallback
        metric: ['Metric', 'sans-serif'], // Add fallback
        metricLight: ['Metric', 'sans-serif'],
        metricSemibold: ['MetricHPEXS-Semibold', 'sans-serif'],
        metricRegular: ['MetricHPEXS', 'sans-serif'],
        metricMedium: ['MetricHPEXS-Medium', 'sans-serif'],
        glyphicons: ['HPE-Glyphicons', 'sans-serif'],
      },
      colors: {
        background: "#ffff",
        foreground: "#191919",
        'black-translucent': 'rgba(0, 0, 0, 0.54)',
        'off-white-primary':'#EEEEEE', // ref : this is the background color used in header and footer
        'custom-light-blue': 'rgba(149, 206, 255, 0.32)',
        'custom-light-red': 'rgba(255, 71, 71, 0.32)',
        'custom-green-light': 'rgba(0, 168, 129, 0.15)',
        'gray-300': '#B1B1B1', // Custom gray color
        'green-mist':'#00B1882E', // ref : used as bg for status label
        'green-100': '#00A881', // Custom light green color
        'green-300': '#01A982', // Custom green color for button text/icon/background
        'green-500': '#1CD3A8', // Another green color for contrast if needed
        'primary-black':'#020103', // black color, ref: navbar background
        'steel-gray': '#ADB3CC', // blue tint with gray, ref: navigation option color
        // 'steel-gray-shade': '#55597D', // blue tint with gray, ref: navigation option color
        'faded-grey':'#475467',
        'grey-100': '#F9F9F9',
        'grey-800':'#444444',
        'grey-500' : '#6F6F6F',
        'grey-300' : '#7F7F7F',
        'grey-200' : '#D0D0D0',
        'grey-700' : '#62697626', // ref : non selected portion of range slider
        'crystal-blue-500':'#5DB9FF',
        'crystal-blue-200':'#EBF6FF',
        // 'lighter-grey-200' : '#F6F6F6',
        // // 'lighter-grey-500' : '#383838',
        'fileupload-grey' : '#f7f9fb', 
        'fileupload-text' : "#160647",
        'yellow-shade-300' : "#B0890E",
        sectionGrey:{
          DEFAULT : '#F6F6F6',
          darker : '#dedede',
          Liner : '#eeeeee',
          lighter : '#fbfbfb'
        },
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
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            hr: {
              marginTop: '.5em',    // Reduced from default (usually 2em or more)
              marginBottom: '.5em', // Reduced from default
              borderColor: theme('colors.gray.300'), // Optional: ensure consistent color
            },
            // You can add other prose customizations here if needed
          },
        },
        // Add customizations for other prose variants like prose-sm if used
        sm: {
          css: {
            hr: {
              marginTop: '0.5em', // Adjust for smaller prose
              marginBottom: '0.5em',
              borderColor: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    tailwindcssAnimate,
    tailwindScrollbar,
    tailwindcssTypography,
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



