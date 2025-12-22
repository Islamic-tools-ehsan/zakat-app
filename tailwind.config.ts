import type { Config } from "tailwindcss";

const config: Config = {
  // This section tells Tailwind: "Look at page.tsx and apply the styles"
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom emerald and slate colors are handled via CSS variables in your globals.css
    },
  },
  plugins: [],
};
export default config;
