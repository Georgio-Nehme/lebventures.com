/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#0F2214', // deep dark forest green (footer/hero bg)
          primary: '#1C3818', // main forest green (LEBVENTURES logo text)
          olive:   '#4A6830', // olive green
          sage:    '#7A9050', // sage green hills
          lime:    '#90B060', // lighter sage-green (text on dark backgrounds)
          gold:    '#D4890A', // sun amber/gold (logo sun)
          sky:     '#E8EFE0', // light green tint background
          sand:    '#C8A868', // warm sandy beige
          teal:    '#2A4D68', // blue teal (water layer in logo)
        },
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        script:  ['Dancing Script', 'cursive'],
        body:    ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
