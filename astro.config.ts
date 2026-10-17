import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cctvbench.com',
  // English is the root locale; Traditional Chinese lives under /zh-tw/ (lowercase path, BCP 47 code for hreflang)
  i18n: {
    defaultLocale: 'en',
    locales: ['en', { path: 'zh-tw', codes: ['zh-TW'] }],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
