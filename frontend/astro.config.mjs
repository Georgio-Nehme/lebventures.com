// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap({
      // Exclude admin panel from the public sitemap
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  site: 'https://lebventures.com',
});
