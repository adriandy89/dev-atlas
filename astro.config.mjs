// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // TODO: la URL real será https://dev-atlas.<subdominio-cuenta>.workers.dev —
  // sustitúyela tras el primer `pnpm run deploy` (wrangler la imprime) y
  // recompila para regenerar canonicals/sitemap/robots. Con dominio propio:
  // cámbiala aquí y añade "routes" en wrangler.jsonc.
  site: 'https://dev-atlas.workers.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      // Doble tema: el CSS de global.css aplica las variables --shiki-dark
      // cuando el tema efectivo es oscuro (ver "Bloques Shiki").
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 600],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff2'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
