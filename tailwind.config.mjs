/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#142800', // deep dark green (silhouette)
          primary: '#3c6414', // forest green (logo text)
          olive:   '#3c5000', // olive green
          mid:     '#78a014', // medium green (hills)
          lime:    '#78b400', // bright lime green (hills highlight)
          gold:    '#f0c800', // sun yellow / gold accent
          sky:     '#daeef7', // light sky blue (background)
        },
      },
      fontFamily: {
        heading: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
