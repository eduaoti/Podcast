/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ["Inter","ui-sans-serif","system-ui","-apple-system","Segoe UI","Roboto","Helvetica Neue","Arial"],
          display: ["Poppins","ui-sans-serif","system-ui"]
        },
        colors: {
          brand: { DEFAULT:"#7c3aed", 600:"#7c3aed" },
          mint: { 500:"#6ee7d2" }
        },
        boxShadow: { soft: "0 10px 30px -10px rgba(90,20,200,.25)" }
      },
    },
    darkMode: "class",
    plugins: [],
  }
  