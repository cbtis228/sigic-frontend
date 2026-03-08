/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0F9FF", // azul muy claro (fondos)
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8", // azul celeste fuerte
          500: "#0EA5E9", // azul principal
          600: "#0284C7", // azul oscuro accesible
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E", // casi navy
          950: "#082F49", // súper oscuro, contraste para texto
        },
      },
    },
  },
  plugins: [require("tailwindcss-primeui")],
  safelist: [
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
    "grid-cols-11",
    "grid-cols-12",
    "col-span-1",
    "col-span-2",
    "col-span-3",
    "col-span-4",
    "col-span-5",
    "col-span-6",
    "col-span-7",
    "col-span-8",
    "col-span-9",
    "col-span-10",
    "col-span-11",
    "col-span-12",
    "lg:grid-cols-1",
    "lg:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",
    "lg:grid-cols-5",
    "lg:grid-cols-6",
    "lg:grid-cols-7",
    "lg:grid-cols-8",
    "lg:grid-cols-9",
    "lg:grid-cols-10",
    "lg:grid-cols-11",
    "lg:grid-cols-12",
  ],
};
