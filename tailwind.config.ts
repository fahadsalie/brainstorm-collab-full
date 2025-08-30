import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#5f91ff',
          700: '#1f65ff'
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        'xl2': '1.25rem'
      }
    }
  },
  plugins: []
};
export default config;
