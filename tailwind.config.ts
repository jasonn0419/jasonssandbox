import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brandNavy: '#0f2c52',
        brandOrange: '#f58220',
        paper: '#f8fafc'
      }
    }
  },
  plugins: []
};

export default config;
