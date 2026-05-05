// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://camaraenagib.adv.br',

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
