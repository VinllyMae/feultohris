/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",      // Target all files inside the app directory
    "./src/components/**/*.{js,ts,jsx,tsx}", // If you have a components folder
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",  // Custom variable usage
        foreground: "var(--foreground)",  // Custom variable usage
      },
    },
  },
  plugins: [],
};
