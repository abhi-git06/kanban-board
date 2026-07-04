/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        kanban: {
          bg: '#f4f5f7',
          card: '#ffffff',
          column: '#ebecf0',
          primary: '#0052cc',
          primaryHover: '#0747a6',
          danger: '#de350b',
          success: '#36b37e',
          warning: '#ffab00',
          text: '#172b4d',
          textMuted: '#5e6c84',
          border: '#dfe1e6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        modal: '0 8px 16px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [],
};