import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Canonical portal: https://sensos.org (GitHub Pages / custom domain)
export default defineConfig({
  site: 'https://sensos.org',
  base: '/',
  // Use 'never' so static JSON API endpoints are not emitted as directories.
  trailingSlash: 'never',
  redirects: {
    '/rfc': '/Open-Standards/RFCs',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/api/'),
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
