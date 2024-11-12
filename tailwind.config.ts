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
        'off-white-primary':'#EEEEEE', // ref : this is the background color used in header and footer
        'gray-300': '#B1B1B1', // Custom gray color
        'green-100': '#00A881', // Custom light green color
        'green-300': '#01A982', // Custom green color for button text/icon/background
        'green-500': '#1CD3A8', // Another green color for contrast if needed
        'primary-black':'#020103', // black color, ref: navbar background
        'steel-gray': '#ADB3CC', // blue tint with gray, ref: navigation option color
        'steel-gray-shade': '#55597D' // blue tint with gray, ref: navigation option color
      },
      boxShadow: {
        'dropdown-shadow': '0px 4px 14px 0px rgba(0, 0, 0, 0.10)',
      },
    },
  },
  plugins: [],
};
export default config;

// <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path opacity="0.4" d="M13.6166 1.6665H6.39163C3.56663 1.6665 1.66663 3.64983 1.66663 6.59983V13.4082C1.66663 16.3498 3.56663 18.3332 6.39163 18.3332H13.6166C16.4416 18.3332 18.3333 16.3498 18.3333 13.4082V6.59983C18.3333 3.64983 16.4416 1.6665 13.6166 1.6665Z" fill="#ADB3CC"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M9.27052 6.82442C9.27052 7.22609 9.59636 7.55359 9.99552 7.55359C10.4064 7.55359 10.733 7.22609 10.733 6.82442C10.733 6.42275 10.4064 6.09525 10.0039 6.09525C9.59969 6.09525 9.27052 6.42275 9.27052 6.82442ZM10.7247 9.46842C10.7247 9.06675 10.3972 8.73925 9.99552 8.73925C9.59386 8.73925 9.26636 9.06675 9.26636 9.46842V13.1518C9.26636 13.5534 9.59386 13.8809 9.99552 13.8809C10.3972 13.8809 10.7247 13.5534 10.7247 13.1518V9.46842Z" fill="#ADB3CC"/>
// </svg>


