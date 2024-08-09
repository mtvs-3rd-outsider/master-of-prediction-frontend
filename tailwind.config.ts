import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
const defaultTheme = require('tailwindcss/defaultTheme');
// const withMT = require("@material-tailwind/react/utils/withMT");
const {nextui} = require("@nextui-org/react");

const config: Config =  ({
  mode: 'jit',
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ["var(--font-mona-sans)", ...fontFamily.sans],
        sans: ["var(--font-mona-sans)", ...fontFamily.sans],
      },
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          ...defaultTheme.colors.slate},
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/aspect-ratio"),
    nextui()
  ],
});

export default config;

 
 
