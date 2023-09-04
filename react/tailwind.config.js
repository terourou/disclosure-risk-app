/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rise: {
          "75%, 100%": { opacity: 0 },
          "75%": { transform: "translateY(-100%)" },
        },
        sink: {
          "75%, 100%": { opacity: 0 },
          "75%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        rise: "rise 1s linear infinite",
        sink: "sink 1s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
