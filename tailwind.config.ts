import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
const defaultTheme = require("tailwindcss/defaultTheme");
// const withMT = require("@material-tailwind/react/utils/withMT");
const { nextui } = require("@nextui-org/theme");
const { mauve, violet, red, blackA } = require("@radix-ui/colors");

const config: Config = {
  mode: "jit",
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
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          ...defaultTheme.colors.slate,
        },
        ...mauve,
        ...violet,
        ...red,
        ...blackA,
      },
    },
    keyframes: {
      overlayShow: {
        from: { opacity: "0" },
        to: { opacity: "1" },
      },
      contentShow: {
        from: { opacity: "0", transform: "translate(-50%, -48%) scale(0.96)" },
        to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
      },
    },
    animation: {
      overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/aspect-ratio"),
    nextui({
      themes: {
        light: {
          extend: "light", // <- inherit default values from dark theme
          colors: {
            background: "#ffffff",
            foreground: "#000000",
            primary: {
              50: "#001F3F", // Deep Navy Blue
              100: "#003366", // Dark Blue
              200: "#004C99", // Medium Blue
              300: "#0066CC", // Bright Blue
              400: "#007BFF", // Standard Blue
              500: "#3399FF", // Light Blue
              600: "#66B2FF", // Lighter Blue
              700: "#99CCFF", // Very Light Blue
              800: "#CCE5FF", // Pale Blue
              900: "#E6F2FF", // Very Pale Blue
              DEFAULT: "#66B2FF", // Standard Blue as default
              foreground: "#ffffff", // White text on blue backgrounds
            },

            secondary: {
              50: "#331500", // Deep Brownish Orange
              100: "#663300", // Dark Brownish Orange
              200: "#994C00", // Medium Orange
              300: "#CC6600", // Bright Orange
              400: "#FF8000", // Vivid Orange
              500: "#FF9933", // Light Orange
              600: "#FFB266", // Lighter Orange
              700: "#FFCC99", // Very Light Orange
              800: "#FFE5CC", // Pale Orange
              900: "#FFF2E6", // Very Pale Orange
              DEFAULT: "#FF8000", // Vivid Orange as default
              foreground: "#000000", // Black text on orange backgrounds
            },
            focus: "#3399FF", // Light Blue for focus states
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};

export default config;
