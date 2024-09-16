const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "easyorder-green": "var(--easyorder-green)",
        "easyorder-gray": "var(--easyorder-gray)",
        "easyorder-black": "var(--easyorder-black)"
      },
    },
  },
  plugins: [nextui()],
}

