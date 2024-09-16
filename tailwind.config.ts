import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/modal.js",
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
};
export default config;
