/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cBlue: {
          100: "#C0DBEA",
          200: "#0083B0",
        },
        cGray: {
          100: "#CFD9DE",
          // 100: "#A8A8A8",
        },
      },
    },
  },
  plugins: [],
};
