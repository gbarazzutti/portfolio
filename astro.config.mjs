import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages *user* page: serves from the domain root, so `site` is set and
// `base` is deliberately omitted.
export default defineConfig({
  site: 'https://gbarazzutti.github.io',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
