import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
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
  plugins: [],
};
export default config;
