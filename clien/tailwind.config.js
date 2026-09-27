module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        'primary-orange': '#D17842',
        'primary-black': '#0C0F14',
        'primary-dark-grey': '#141921',
        'primary-grey': '#252A32',
        'primary-light-grey': '#52555A',
        'primary-white': '#F3F3F3',
        'primary-very-white': '#FFFFFF',
        'secondary-dark-grey': '#21262E',
        'secondary-grey': '#252A32',
        'secondary-light-grey': '#AEAEAE',
        'primary-red': '#DC3535',
      },
      fontFamily: {
        'poppins-regular': ['Poppins-Regular'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-bold': ['Poppins-Bold'],
      },
    },
  },
  plugins: [],
};