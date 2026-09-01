import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Deployed to Netlify at the site root, so `site` is set and `base` is omitted.
export default defineConfig({
  site: 'https://guillermobarazzutti.netlify.app',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /gracias is a post-submit page — noindex, keep it out of the sitemap.
      filter: (page) => !page.endsWith('/gracias') && !page.endsWith('/gracias/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
