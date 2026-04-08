import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gb: {
          bg: "#070707",
          panel: "#111111",
          card: "#161616",
          text: "#f2f2f2",
          muted: "#b3b3b3",
          green: "#4caf50",
          "green-soft": "#1f4122",
          cta: "#d61d1d",
          "cta-hover": "#f03030",
          line: "#2c2c2c",
          input: "#0b0b0b",
        },
        // keep gsgl aliases for fitting pages (unchanged)
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
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        panel: "0 18px 35px rgba(0,0,0,0.35)",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
