/**
 * ============================================================
 * CONFIGURACIÓN CENTRAL DEL SITIO
 * ============================================================
 * Cambia aquí el nombre de la marca, autor, redes, etc.
 * Todo el sitio lee de este archivo — un solo lugar que editar.
 *
 * OJO: el dominio (`site`) se configura en `astro.config.mjs`,
 * porque Astro lo necesita en tiempo de build (sitemap, URLs
 * canónicas, Open Graph).
 */

export const SITE = {
  /** Nombre de la marca (cabecera, footer, títulos y JSON-LD) */
  name: 'DevAtlas',

  /** Descripción corta del sitio (meta description por defecto y JSON-LD) */
  description:
    'Atlas de conocimiento de ingeniería de software en español: algoritmos, buenas prácticas, patrones de diseño, problemas resueltos y quiz interactivos.',

  /** Autor del sitio (JSON-LD y página Sobre) */
  author: 'Adrian DY',

  /** Perfiles públicos (footer y JSON-LD) */
  social: {
    github: 'https://github.com/adriandy89',
  },

  /** Imagen para compartir en redes (Open Graph), 1200×630. */
  ogImage: '/og.webp',
} as const;
