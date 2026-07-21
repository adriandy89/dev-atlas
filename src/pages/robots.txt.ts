import type { APIRoute } from 'astro';

/**
 * robots.txt dinámico: reutiliza `site` de astro.config.mjs para que
 * la URL del sitemap nunca se desincronice del dominio configurado.
 */
const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
