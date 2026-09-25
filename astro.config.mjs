import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://7yewh.github.io',
  markdown: {
    smartypants: false,
    shikiConfig: { theme: 'min-dark' },
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
