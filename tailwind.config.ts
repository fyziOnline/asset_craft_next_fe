import type { Config } from "tailwindcss";

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
  		fontFamily: {
  			inter: ['Inter', 'sans-serif']
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'off-white-primary': '#EEEEEE',
  			'custom-light-blue': 'rgba(149, 206, 255, 0.32)',
  			'custom-light-red': 'rgba(255, 71, 71, 0.32)',
  			'gray-300': '#B1B1B1',
  			'green-100': '#00A881',
  			'green-300': '#01A982',
  			'green-500': '#1CD3A8',
  			'primary-black': '#020103',
  			'steel-gray': '#ADB3CC',
  			'steel-gray-shade': '#55597D',
  			'faded-grey': '#475467',
  			'grey-800': '#444444',
  			'grey-500': '#6F6F6F',
  			'crystal-blue-500': '#5DB9FF',
  			'crystal-blue-200': '#EBF6FF',
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
  			'search-box-shadow': '0px 2.106px 1.053px 0px rgba(0, 0, 0, 0.10);'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
      require("tailwindcss-animate")
],
};
export default config;



