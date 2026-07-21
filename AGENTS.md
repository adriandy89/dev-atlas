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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
