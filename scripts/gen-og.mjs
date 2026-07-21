/**
 * Genera public/og.webp (1200×630) — imagen Open Graph para compartir en redes.
 *
 * Úsalo cuando cambies el nombre de la marca o el tagline:
 *   1. Edita NAME/TAGLINE abajo
 *   2. node scripts/gen-og.mjs
 *
 * O sustituye public/og.webp por un diseño propio (1200×630, WebP).
 */
import sharp from 'sharp';

const TAGLINE_TOP = 'CONOCIMIENTO DE INGENIERÍA DE SOFTWARE';
const TAGLINE_BOTTOM = 'Temas · Problemas · Quiz · Glosario · Recursos';

const dots = [];
for (let x = 40; x < 1200; x += 34) {
  for (let y = 40; y < 630; y += 34) {
    dots.push(`<circle cx="${x}" cy="${y}" r="1.1" fill="rgba(148,197,255,0.07)"/>`);
  }
}

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="aurora" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="1" stop-color="#a78bfa"/>
    </linearGradient>
    <radialGradient id="glowCyan" cx="0.15" cy="0" r="0.85">
      <stop offset="0%" stop-color="rgba(34,211,238,0.22)"/>
      <stop offset="70%" stop-color="rgba(34,211,238,0)"/>
    </radialGradient>
    <radialGradient id="glowViolet" cx="0.85" cy="0.1" r="0.85">
      <stop offset="0%" stop-color="rgba(139,92,246,0.2)"/>
      <stop offset="70%" stop-color="rgba(139,92,246,0)"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#070b14"/>
  ${dots.join('')}
  <rect width="1200" height="630" fill="url(#glowCyan)"/>
  <rect width="1200" height="630" fill="url(#glowViolet)"/>
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="rgba(148,197,255,0.15)" stroke-width="2"/>
  <text x="600" y="302" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="106" font-weight="bold" letter-spacing="-2"><tspan fill="#e6edf8">Dev</tspan><tspan fill="url(#aurora)">Atlas</tspan></text>
  <text x="600" y="384" text-anchor="middle" font-family="DejaVu Sans Mono, DejaVu Sans, monospace" font-size="27" fill="#22d3ee" letter-spacing="6">${TAGLINE_TOP}</text>
  <text x="600" y="452" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" fill="#93a3bc">${TAGLINE_BOTTOM}</text>
</svg>`;

const out = new URL('../public/og.webp', import.meta.url).pathname;
await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(out);
const meta = await sharp(out).metadata();
console.log('og.webp generado:', meta.width, 'x', meta.height, meta.format);
