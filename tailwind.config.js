/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },

    extend: {
      colors: {
        stone: "#DCDCD5",
        white: "#ffffff",
        wheat: "#e1ca96",
        sage: "#aca885",
        middlegrey: "#918B76",
        nickel: "#626c66",
        olive: "#434a42",
      },
    },
  },
};
