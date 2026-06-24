/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind scanne ces fichiers pour générer uniquement les classes utilisées
  content: ['./src/**/*.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        navy:        '#0B1B32',
        'navy-light': '#0F2444',
        'navy-border': '#1A3356',
        gold:        '#ECD084',
        'gold-dark': '#B08B3A',
        'text-cream': '#F0E8D0',
        'text-muted': '#9AACC0',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
