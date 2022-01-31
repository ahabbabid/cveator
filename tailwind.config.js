module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      cursor: {
        edit: 'url(../public/edit-solid.svg), pointer',
      },
    },
  },
  plugins: [],
}
