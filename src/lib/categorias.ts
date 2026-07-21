/**
 * Fuente única de verdad de las categorías del sitio.
 *
 * El tuple `CATEGORY_SLUGS` alimenta el z.enum de `src/content.config.ts`:
 * cualquier contenido con una categoría fuera de esta lista rompe el build.
 * Para añadir una categoría: añade el slug aquí, su entrada en `CATEGORIAS`
 * y un icono con el mismo nombre en `src/components/Icon.astro`.
 */

export const CATEGORY_SLUGS = [
  'algoritmos',
  'estructuras-de-datos',
  'patrones-de-diseno',
  'arquitectura',
  'buenas-practicas',
  'metodologias',
  'testing',
  'devops',
  'bases-de-datos',
  'seguridad',
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export interface Categoria {
  slug: CategorySlug;
  /** Nombre visible ("Patrones de diseño") */
  name: string;
  /** Una frase para tarjetas y meta descriptions */
  description: string;
  /** Clave del registro de `Icon.astro` */
  icon: string;
  /** Acento de la tarjeta (variable CSS del sistema Aurora) */
  color: 'cyan' | 'violet';
}

export const CATEGORIAS: Record<CategorySlug, Categoria> = {
  algoritmos: {
    slug: 'algoritmos',
    name: 'Algoritmos',
    description: 'Búsqueda, ordenación, recursión y análisis de complejidad.',
    icon: 'algoritmos',
    color: 'cyan',
  },
  'estructuras-de-datos': {
    slug: 'estructuras-de-datos',
    name: 'Estructuras de datos',
    description: 'Arrays, listas, pilas, colas, árboles, grafos y tablas hash.',
    icon: 'estructuras-de-datos',
    color: 'violet',
  },
  'patrones-de-diseno': {
    slug: 'patrones-de-diseno',
    name: 'Patrones de diseño',
    description: 'Soluciones probadas a problemas recurrentes del diseño de software.',
    icon: 'patrones-de-diseno',
    color: 'cyan',
  },
  arquitectura: {
    slug: 'arquitectura',
    name: 'Arquitectura de software',
    description: 'Monolitos, microservicios, eventos, capas y decisiones a gran escala.',
    icon: 'arquitectura',
    color: 'violet',
  },
  'buenas-practicas': {
    slug: 'buenas-practicas',
    name: 'Buenas prácticas',
    description: 'Clean code, SOLID, refactorización y código mantenible.',
    icon: 'buenas-practicas',
    color: 'cyan',
  },
  metodologias: {
    slug: 'metodologias',
    name: 'Metodologías',
    description: 'Agile, Scrum, Kanban, XP y formas de organizar el trabajo.',
    icon: 'metodologias',
    color: 'violet',
  },
  testing: {
    slug: 'testing',
    name: 'Testing',
    description: 'Pruebas unitarias, de integración, E2E, TDD y estrategias de calidad.',
    icon: 'testing',
    color: 'cyan',
  },
  devops: {
    slug: 'devops',
    name: 'DevOps y CI/CD',
    description: 'Integración continua, despliegue, contenedores y observabilidad.',
    icon: 'devops',
    color: 'violet',
  },
  'bases-de-datos': {
    slug: 'bases-de-datos',
    name: 'Bases de datos',
    description: 'Modelado, SQL, NoSQL, índices, transacciones y rendimiento.',
    icon: 'bases-de-datos',
    color: 'cyan',
  },
  seguridad: {
    slug: 'seguridad',
    name: 'Seguridad',
    description: 'OWASP, autenticación, autorización y desarrollo seguro.',
    icon: 'seguridad',
    color: 'violet',
  },
};

export const listaCategorias = CATEGORY_SLUGS.map((slug) => CATEGORIAS[slug]);
