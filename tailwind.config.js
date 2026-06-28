/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Our deep, inky glassmorphism dark mode palette
        background: '#0F172A', // slate-900
        surface: '#1E293B',    // slate-800
        primary: '#38BDF8',    // sky-400 (for sleek accents)
      },
      fontFamily: {
        // Setting up our serif for those premium financial numbers
        serif: ['Georgia', 'serif'],
        sans: ['System', 'sans-serif'],
      }
    },
  },
  plugins: [],
}