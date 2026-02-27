/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Principal
        violet: {
          DEFAULT: "#7C3AED",
          deep: "#4C1D95",
          dark: "#5B21B6",
          light: "#8B5CF6",
          lighter: "#A78BFA",
        },
        night: {
          DEFAULT: "#0F0A1A",
          light: "#1A1128",
          lighter: "#2D1F4E",
        },
        lime: {
          DEFAULT: "#BFFF00",
        },
        gold: {
          DEFAULT: "#FFD700",
        },
        lavender: "#DDD6FE",
        lilac: "#C4B5FD",
        indigo: {
          DEFAULT: "#818CF8",
        },

        // Estados
        state: {
          active: "#7C3AED",
          waiting: "#BFFF00",
          celebrating: "#FFFFFF",
          pivoted: "#818CF8",
          hero: "#FFD700",
        },
      },

      fontFamily: {
        display: ["Montserrat", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        // Panel (LED) sizes
        "panel-hero": ["192px", { lineHeight: "1.1" }],
        "panel-team-celebration": ["128px", { lineHeight: "1.1" }],
        "panel-stage-name": ["96px", { lineHeight: "1.1" }],
        "panel-stage-label": ["64px", { lineHeight: "1.2" }],
        "panel-team-name": ["48px", { lineHeight: "1.2" }],
        "panel-info": ["36px", { lineHeight: "1.3" }],
        "panel-small": ["24px", { lineHeight: "1.3" }],

        // Admin sizes
        "admin-h1": ["24px", { lineHeight: "1.3" }],
        "admin-h2": ["20px", { lineHeight: "1.3" }],
        "admin-body": ["16px", { lineHeight: "1.5" }],
        "admin-small": ["14px", { lineHeight: "1.5" }],
        "admin-mono": ["13px", { lineHeight: "1.5" }],
      },

      spacing: {
        "safe": "64px",
        "panel-1": "8px",
        "panel-2": "16px",
        "panel-3": "24px",
        "panel-4": "32px",
        "panel-6": "48px",
        "panel-8": "64px",
        "panel-12": "96px",
        "panel-16": "128px",
      },

      borderRadius: {
        card: "16px",
        button: "8px",
        badge: "6px",
      },

      borderWidth: {
        card: "3px",
        "card-hero": "4px",
        trail: "6px",
      },

      boxShadow: {
        "glow-violet": "0 0 20px rgba(124, 58, 237, 0.5)",
        "glow-violet-intense": "0 0 40px rgba(124, 58, 237, 0.8)",
        "glow-lime": "0 0 24px rgba(191, 255, 0, 0.6)",
        "glow-white": "0 0 40px rgba(255, 255, 255, 0.8)",
        "glow-gold": "0 0 30px rgba(255, 215, 0, 0.7)",
        "glow-trail": "0 0 12px rgba(124, 58, 237, 0.3)",
        "card-elevated": "0 8px 32px rgba(0, 0, 0, 0.4)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        celebrate: "cubic-bezier(0.22, 1, 0.36, 1)",
      },

      animation: {
        "pulse-waiting": "pulse-waiting 2s ease-in-out infinite",
        "blob-morph": "blob-morph 20s ease-in-out infinite",
        "flash-white": "flash-white 0.3s ease-out",
        "card-bounce": "card-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "vibrate": "vibrate 0.4s linear",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-hero": "scale-hero 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      keyframes: {
        "pulse-waiting": {
          "0%, 100%": { opacity: "0.4", boxShadow: "0 0 12px rgba(191, 255, 0, 0.3)" },
          "50%": { opacity: "1", boxShadow: "0 0 24px rgba(191, 255, 0, 0.6)" },
        },
        "blob-morph": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40%/50% 60% 30% 60%" },
        },
        "flash-white": {
          "0%": { opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { opacity: "0" },
        },
        "card-bounce": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        "vibrate": {
          "0%, 100%": { transform: "translateX(0)" },
          "12.5%": { transform: "translateX(-3px)" },
          "25%": { transform: "translateX(3px)" },
          "37.5%": { transform: "translateX(-3px)" },
          "50%": { transform: "translateX(3px)" },
          "62.5%": { transform: "translateX(-3px)" },
          "75%": { transform: "translateX(3px)" },
          "87.5%": { transform: "translateX(-3px)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-hero": {
          "0%": { transform: "scale(0)" },
          "70%": { transform: "scale(1.2)" },
          "100%": { transform: "scale(1)" },
        },
      },

      aspectRatio: {
        "panel": "2/1",
        "card": "5/6",
      },

      zIndex: {
        background: "0",
        trail: "10",
        cards: "20",
        "card-elevated": "30",
        "celebration-overlay": "40",
        "hero-takeover": "50",
        "status-indicators": "60",
      },
    },
  },
  plugins: [],
};
