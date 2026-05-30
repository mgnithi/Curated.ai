/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names.
  // It removes unused styles in production, keeping the bundle tiny.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      // ── Curated.ai brand colours ──────────────────────────────────────
      colors: {
        brand: {
          navy:       "#1E2A6E",   // primary brand / headers
          teal:       "#0F8A8D",   // buttons, badges, accents
          "teal-dark":"#0c7477",   // teal hover state
          "teal-light":"#E6F5F5",  // selected chip backgrounds
        },
      },

      // ── Border radius ─────────────────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",    // cards
        "3xl": "1.5rem",  // phone / modal frames
      },

      // ── Font family ───────────────────────────────────────────────────
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },

      // ── Box shadows ───────────────────────────────────────────────────
      boxShadow: {
        card: "0 1px 4px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.10)",
      },
    },
  },

  plugins: [],
};
