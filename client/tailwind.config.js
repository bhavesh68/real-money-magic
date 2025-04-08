/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'money-bg': "url('/assets/MoneyMagicBG.png')",
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
      },
      animation: {
        twinkle: 'twinkle 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

