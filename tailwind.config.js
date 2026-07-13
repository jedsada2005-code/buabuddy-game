/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    'bg-sky-50',
    'border-sky-200',
    'bg-green-50',
    'border-green-200',
    'bg-blue-50',
    'border-blue-200',
    'bg-purple-50',
    'border-purple-200',
    'bg-orange-50',
    'border-orange-200'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
