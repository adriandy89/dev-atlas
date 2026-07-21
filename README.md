# DevAtlas

Atlas de conocimiento de ingeniería de software: temas, problemas resueltos, quiz interactivo, glosario y recursos. En español.

Construido con [Astro](https://astro.build) (estático, sin frameworks UI), CSS artesanal con glassmorphism y tema claro/oscuro, y desplegado en Cloudflare Workers como sitio de solo assets.

## Comandos

| Comando | Acción |
| --- | --- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Servidor de desarrollo en `localhost:4321` |
| `pnpm build` | Compila el sitio a `./dist/` (valida todo el contenido) |
| `pnpm preview` | Previsualiza el build localmente |
| `pnpm run cf-preview` | Build + `wrangler dev` (simula Cloudflare en local) |
| `pnpm run deploy` | Build + despliegue a Cloudflare Workers |
| `node scripts/gen-og.mjs` | Regenera `public/og.webp` (imagen para redes) |

## Cómo añadir contenido

Todo el contenido vive en `src/content/` y se valida en build (`src/content.config.ts`). Las categorías válidas están en `src/lib/categorias.ts`.

### Un tema (artículo)

Crea `src/content/temas/<categoria>/<slug>.md`:

```md
---
title: Búsqueda binaria
description: Cómo funciona y cuándo usarla.
category: algoritmos          # debe coincidir con la carpeta
level: fundamentos            # fundamentos | intermedio | avanzado
tags: [busqueda, arrays]
updated: 2026-07-21
order: 1                      # posición dentro de la categoría (opcional)
draft: false                  # true = visible solo en dev
---

Contenido en markdown con `## Encabezados` (alimentan el índice lateral)…
```

### Un problema

Crea `src/content/problemas/<slug>.md`. Las pistas van en el frontmatter (`hints`); la solución, colapsada dentro del cuerpo:

```md
---
title: Paréntesis balanceados
description: Valida si una cadena de paréntesis está balanceada.
difficulty: medio             # facil | medio | dificil
category: estructuras-de-datos
tags: [pilas]
hints:
  - Piensa qué estructura recuerda "lo último que se abrió".
updated: 2026-07-21
---

Enunciado con ejemplos de entrada/salida…

<details class="solucion">
<summary>Ver solución</summary>

Explicación y código (deja líneas en blanco para que el markdown interior se procese).

</details>
```

### Una pregunta de quiz

Un archivo = una pregunta. Crea `src/content/preguntas/<categoria>/<nombre>.yaml`:

```yaml
question: "¿Complejidad de la búsqueda binaria en el peor caso?"
options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"]
correct: 1 # índice (desde 0) de la opción correcta
explanation: >-
  Cada paso descarta la mitad del espacio de búsqueda.
category: algoritmos
difficulty: facil
```

### Glosario y recursos

Añade entradas a los arrays de `src/content/glosario/terminos.yaml` y `src/content/recursos/recursos.yaml`.

## Despliegue (Cloudflare Workers)

1. `wrangler login` (solo la primera vez)
2. `pnpm run deploy`
3. Tras el primer despliegue, copia la URL real (`dev-atlas.<cuenta>.workers.dev`) en `site` de `astro.config.mjs` y vuelve a desplegar.

Con dominio propio: cambia `site` y añade `routes` en `wrangler.jsonc` (ver comentarios en ese archivo).
