const PALABRAS_POR_MINUTO = 200;

/**
 * Minutos de lectura estimados a partir del markdown crudo
 * (`entry.body`, que el loader glob conserva por defecto).
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const palabras = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO));
}
