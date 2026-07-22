/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#171226',
          soft: '#221A38',
          mute: '#4A415F',
        },
        parchment: '#F7F4EE',
        gold: {
          DEFAULT: '#C99938',
          bright: '#E4B14A',
          deep: '#9C7422',
        },
        plum: {
          DEFAULT: '#7B3A6E',
          deep: '#5C2A52',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4 Variable"', 'Georgia', 'serif'],
      },
      maxWidth: {
        site: '76rem',
      },
    },
  },
  plugins: [],
}
