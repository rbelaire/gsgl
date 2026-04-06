import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gsgl: {
          navy: "#0B1F3A",
          gold: "#C8A96B",
          offwhite: "#F7F5F0",
          dark: "#111827",
          gray: "#6B7280",
          slate: "#425b78",
          sand: "#f2ede0",
        },
      },
      boxShadow: {
        panel: "0 8px 24px rgba(11, 31, 58, 0.08)",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
