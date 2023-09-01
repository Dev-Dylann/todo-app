/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.ts"],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: ["Ubuntu", "sans"],
      },
      colors: {
        coolGray: {
          DEFAULT: "#CBE1E3",
          dark: "#BAD0D2",
        },
        crimson: {
          DEFAULT: "#D80032",
          imperial: "#EF233C",
        },
        spaceGray: {
          DEFAULT: "#2B2D42",
          light: "#3C3E53",
        },
      },
    },
  },
  plugins: [],
};
