import type { Config } from "tailwindcss";

// Tokens sourced from DESIGN.md — do not hardcode raw hex/oklch values
// in components; extend this scale instead.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "oklch(100% 0 0)", // #FFFFFF
        surface: "oklch(93.5% 0.005 78.3)", // #EBE9E6
        brand: {
          DEFAULT: "oklch(54.2% 0.254 262.2)", // #005AFF
          dark: "oklch(45.9% 0.214 262.1)", // #0047CC
          light: "oklch(60.7% 0.213 261.9)", // #3378FF
        },
        ink: {
          DEFAULT: "oklch(17.8% 0 0)", // #111111
          muted: "oklch(42% 0 0)", // #4D4D4D
        },
        line: "oklch(85.5% 0.005 78.3)", // #D8D5D0
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        body: [
          "Helvetica Neue",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["clamp(2.5rem, 4vw + 1rem, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        milestone: ["clamp(2rem, 3vw + 1rem, 4rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        measure: "65ch",
      },
      zIndex: {
        world: "0",
        scene: "10",
        caption: "50",
        nav: "60",
        live: "70",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
