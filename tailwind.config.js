module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "hero-pattern": "url('/src/assets/waves.png')",
      }),
      keyframes: {
        pulse: {
          "0%, 100%": {
            opacity: "0.25",
          },
          "50%": {
            opacity: ".1",
          },
        },
      },
      animation: {
        pulse: "pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
