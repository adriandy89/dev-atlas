## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Content map

All content lives in `src/content/` and is validated by zod schemas in `src/content.config.ts`:

- `temas/<categoria>/<slug>.md` — knowledge-base articles (markdown). `category` in frontmatter must match the folder and be one of the slugs in `src/lib/categorias.ts`.
- `problemas/<slug>.md` — coding problems. Hints go in frontmatter (`hints`); the solution goes inside the body as `<details class="solucion">…</details>` (blank lines around inner markdown).
- `preguntas/<categoria>/<archivo>.yaml` — one file = one quiz question (`question`, `options`, `correct` index, `explanation`, `category`, `difficulty`).
- `glosario/terminos.yaml` — single YAML array of terms.
- `recursos/recursos.yaml` — single YAML array of curated external resources.

Category list (single source of truth): `src/lib/categorias.ts`. UI chrome strings: `src/ui.ts` (typed, Spanish-only for now — add `en` there when going bilingual).

All internal links must end with `/` (`trailingSlash: 'always'`).

## Progreso de usuario (localStorage)

El progreso se guarda **solo en el navegador** (sin backend → el sitio sigue siendo 100% estático). Dos claves independientes:

- `devatlas.quiz.v1` — estadísticas del quiz (`src/lib/quiz-types.ts`).
- `devatlas.progress.v1` — temas leídos, problemas resueltos, favoritos y racha de estudio (`src/lib/progress-types.ts` + `src/lib/progress.ts`).

Todo acceso va envuelto en `try/catch` y degrada en silencio (modo privado, cuota). Patrón para **leer** progreso: pinta sobre HTML estático desde un `<script>` (ver `src/pages/quiz/index.astro` o los hubs). Patrón para **escribir**: la isla `initProgresoAcciones()` de `src/lib/progress-ui.ts`, conectada con un `<div data-progress-accion data-kind="tema|problema" data-id={entry.id}>`. El panel agregado vive en `src/pages/progreso.astro`.

## Widgets y diagramas (en artículos)

Dos formas de enriquecer un `.md`, ambas con HTML crudo (Astro no sanitiza el markdown) y estilos en `src/styles/widgets.css` (globales: los `<style>` scoped **no** alcanzan el DOM inyectado por markdown):

1. **Estático, sin JS** — pega un snippet (Big-O, diagramas SVG, callouts). Funciona sin JavaScript.
2. **Isla interactiva** — un `<div data-widget="NOMBRE">` que hidrata `src/components/widgets/WidgetRuntime.astro` (ya montado en las plantillas de tema y problema). Widgets registrados en `src/scripts/widgets/index.ts`: `stack`, `queue`, `binary-search`, `hash-table`, `mini-quiz`. Carga perezosa: la página solo descarga el JS de los widgets que contiene.

⚠️ **Reglas de líneas en blanco (opuestas según el bloque):**

- `<details class="solucion">` y `<aside class="callout …">` **necesitan** líneas en blanco alrededor **y dentro** (para que su markdown interno se procese).
- `<div data-widget>`, `<script type="application/json">` y los `<svg>`/`<figure>` de diagramas: líneas en blanco **alrededor**, pero **ninguna línea en blanco dentro** — una línea en blanco cierra el bloque HTML de CommonMark y filtra el markup como texto. Prefiere config por `data-*` para evitar el problema.

**Añadir un widget nuevo:** crea `src/scripts/widgets/<nombre>.ts` con `export function mount(el)`, regístralo en `src/scripts/widgets/index.ts`, y añade sus estilos bajo `.prose` en `widgets.css`. Usa solo tokens (`--cyan`, `--violet`, `--grad-aurora`, `--surface`, `--border`, `--facil`, `--dificil`) y `currentColor` en SVG → claro/oscuro gratis. Envuelve las transiciones en `@media (prefers-reduced-motion: no-preference)`. `mount` debe ser idempotente.

**Diagramas:** SVG inline a mano con tokens + `currentColor` (clases `.w-diagram`, `.w-node`, `.w-node-accent`, `.w-edge`, `.w-edge-arrow`). No usamos mermaid-at-build (arrastra Playwright/Chromium a Cloudflare Builds y hornea un solo tema).

### Biblioteca de snippets (copia y pega)

Callout (nota | aviso | truco | idea) — líneas en blanco dentro:

```md
<aside class="callout callout-truco">
<p class="callout-titulo">Truco</p>

Texto en **markdown** con [enlaces](/temas/).
</aside>
```

Widget interactivo — sin líneas en blanco dentro:

```md
<div data-widget="stack"></div>
<div data-widget="queue"></div>
<div data-widget="binary-search" data-array="1,3,4,7,9,11,15" data-target="11"></div>
<div data-widget="hash-table" data-buckets="8"></div>
<div data-widget="mini-quiz" data-count="3" data-difficulty="facil"></div>
```

El `mini-quiz` reutiliza el pool de `preguntas` de la categoría (lo incrusta la plantilla de tema) — no escribas preguntas nuevas para usarlo. El Big-O interactivo y los diagramas de Singleton/Observer están como snippets completos en sus artículos (`notacion-big-o.md`, `singleton.md`, `observer.md`); cópialos de ahí.

### Checklist del autor

- ¿El concepto tiene movimiento o estructura espacial? → considera un widget o diagrama.
- Prefiere un snippet **sin JS** (Big-O, diagrama, callout) antes que una isla.
- Reutiliza `preguntas` con `mini-quiz` antes de escribir preguntas nuevas.
- Comprueba el widget en tema **claro y oscuro** (debe usar tokens, no colores fijos).
- Comprueba con `prefers-reduced-motion` (sin animación) y navegación por teclado.
- Confirma que degrada sin JS (la prosa/tabla alrededor debe bastar).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
