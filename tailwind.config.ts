import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
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
        'custom-light-blue': 'rgba(149, 206, 255, 0.32)',
        'custom-light-red': 'rgba(255, 71, 71, 0.32)',
        'gray-300': '#B1B1B1', // Custom gray color
        'green-100': '#00A881', // Custom light green color
        'green-300': '#01A982', // Custom green color for button text/icon/background
        'green-500': '#1CD3A8', // Another green color for contrast if needed
      },
      boxShadow: {
        'dropdown-shadow': '0px 4px 14px 0px rgba(0, 0, 0, 0.10)',
        'search-box-shadow': '0px 2.106px 1.053px 0px rgba(0, 0, 0, 0.10);'
      },
    },
  },
  plugins: [],
};
export default config;
