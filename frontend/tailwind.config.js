/** @type {import('tailwindcss').Config} */
const daisyui = require('daisyui');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'light', 'dark', 'cupcake', 'retro', 'cyberpunk', 'valentine', 
      'halloween', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe',
      'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 
      'acid', 'lemonade', 'night', 'coffee', 'winter'
    ],
  },
};
