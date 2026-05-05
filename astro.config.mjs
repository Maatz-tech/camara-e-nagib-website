// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.GITHUB_ACTIONS ? 'https://maatz-tech.github.io' : 'https://camaraenagib.adv.br',
  base: process.env.GITHUB_ACTIONS ? '/camara-e-nagib-website' : '/',

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: false,
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },

  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },

  compressHTML: false,
});
