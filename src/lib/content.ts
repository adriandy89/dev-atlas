import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategorySlug } from './categorias';

/** Borradores: visibles en dev, excluidos del build de producción */
const visible = (draft: boolean) => !draft || !import.meta.env.PROD;

const ORDEN_DIFICULTAD = { facil: 0, medio: 1, dificil: 2 } as const;

/** Temas publicados, ordenados por `order` y después por título */
export async function getTemas(categoria?: CategorySlug) {
  const temas = await getCollection(
    'temas',
    ({ data }) => visible(data.draft) && (!categoria || data.category === categoria),
  );
  return temas.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title, 'es'),
  );
}

/** Problemas publicados, ordenados por dificultad y después por título */
export async function getProblemas() {
  const problemas = await getCollection('problemas', ({ data }) => visible(data.draft));
  return problemas.sort(
    (a, b) =>
      ORDEN_DIFICULTAD[a.data.difficulty] - ORDEN_DIFICULTAD[b.data.difficulty] ||
      a.data.title.localeCompare(b.data.title, 'es'),
  );
}

export async function getPreguntas(categoria?: CategorySlug) {
  return getCollection('preguntas', ({ data }) => !categoria || data.category === categoria);
}

/** Último segmento del id del archivo: `algoritmos/busqueda-binaria` → `busqueda-binaria` */
export function slugDeTema(entry: CollectionEntry<'temas'>): string {
  const slug = entry.id.split('/').pop();
  if (!slug) throw new Error(`Id de tema inesperado: ${entry.id}`);
  return slug;
}

/** Nº de temas y preguntas por categoría (para tarjetas de hubs) */
export async function conteosPorCategoria() {
  const [temas, preguntas, problemas] = await Promise.all([
    getTemas(),
    getPreguntas(),
    getProblemas(),
  ]);
  const contar = (items: { data: { category: CategorySlug } }[]) => {
    const conteo = {} as Record<CategorySlug, number>;
    for (const item of items) {
      conteo[item.data.category] = (conteo[item.data.category] ?? 0) + 1;
    }
    return conteo;
  };
  return { temas: contar(temas), preguntas: contar(preguntas), problemas: contar(problemas) };
}

/** Tema anterior y siguiente dentro de una lista ya ordenada */
export function prevNext<T extends { id: string }>(lista: T[], actual: T) {
  const i = lista.findIndex((item) => item.id === actual.id);
  return {
    anterior: i > 0 ? lista[i - 1] : undefined,
    siguiente: i >= 0 && i < lista.length - 1 ? lista[i + 1] : undefined,
  };
}
