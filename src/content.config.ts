import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { CATEGORY_SLUGS } from './lib/categorias';

/**
 * Colecciones de contenido. Todo el contenido de src/content/ se valida
 * aquí en cada build: un frontmatter mal escrito rompe la compilación
 * con un mensaje claro en lugar de publicar una página rota.
 */

const categoria = z.enum(CATEGORY_SLUGS);
const nivel = z.enum(['fundamentos', 'intermedio', 'avanzado']);
const dificultad = z.enum(['facil', 'medio', 'dificil']);

/** Artículos de la base de conocimiento: src/content/temas/<categoria>/<slug>.md */
const temas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/temas' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    category: categoria,
    level: nivel.default('fundamentos'),
    tags: z.array(z.string()).default([]),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
    /** Posición dentro de su categoría (menor = antes) */
    order: z.number().int().default(999),
  }),
});

/** Problemas de programación: src/content/problemas/<slug>.md */
const problemas = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/problemas' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    difficulty: dificultad,
    category: categoria,
    tags: z.array(z.string()).default([]),
    /** Pistas progresivas (se muestran colapsadas antes de la solución) */
    hints: z.array(z.string()).default([]),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

/** Preguntas de quiz: un YAML = una pregunta, en src/content/preguntas/<categoria>/ */
const preguntas = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/preguntas' }),
  schema: z
    .object({
      question: z.string(),
      options: z.array(z.string()).min(2).max(6),
      /** Índice (desde 0) de la opción correcta.
       *  Futuro multi-respuesta: migrar a union number | number[] y adaptar la isla. */
      correct: z.number().int().min(0),
      explanation: z.string(),
      category: categoria,
      difficulty: dificultad,
    })
    .superRefine((q, ctx) => {
      if (q.correct >= q.options.length) {
        ctx.addIssue({
          code: 'custom',
          message: `correct (${q.correct}) fuera de rango: hay ${q.options.length} opciones`,
        });
      }
    }),
});

/** Glosario: array único en src/content/glosario/terminos.yaml (id = slug del término) */
const glosario = defineCollection({
  loader: file('src/content/glosario/terminos.yaml'),
  schema: z.object({
    id: z.string(),
    termino: z.string(),
    definicion: z.string(),
    categoria: categoria.optional(),
    /** ids de otros términos relacionados */
    relacionados: z.array(z.string()).default([]),
  }),
});

/** Recursos externos recomendados: array único en src/content/recursos/recursos.yaml */
const recursos = defineCollection({
  loader: file('src/content/recursos/recursos.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url(),
    description: z.string(),
    category: categoria,
    type: z.enum(['documentacion', 'libro', 'curso', 'video', 'herramienta', 'articulo']),
    lang: z.enum(['es', 'en']).default('es'),
    free: z.boolean().default(true),
  }),
});

export const collections = { temas, problemas, preguntas, glosario, recursos };
