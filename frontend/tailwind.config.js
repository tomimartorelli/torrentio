// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',  // Ajusta esta ruta dependiendo de la estructura de tu proyecto
  ],
  theme: {
    extend: {
      fontFamily: {
        'neue-haas': ['NeueHaas', 'sans-serif'],
        'poppins': ['NeueHaas', 'sans-serif'],
        'montserrat': ['NeueHaas', 'sans-serif'],
        'jost': ['NeueHaas', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
