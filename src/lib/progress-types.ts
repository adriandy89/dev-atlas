/**
 * Tipos y constantes del progreso del usuario, compartidos entre el
 * servidor (páginas que leen totales en build) y el cliente (la isla de
 * progreso). Espejo de `quiz-types.ts`.
 *
 * Se guarda en localStorage bajo una clave PROPIA, separada de la del quiz
 * (`devatlas.quiz.v1`): el quiz ya está en producción con su propio ciclo de
 * versión; el panel de progreso simplemente lee ambas claves.
 */

export const PROGRESS_STORAGE_KEY = 'devatlas.progress.v1';
export const PROGRESS_VERSION = 1;

export type ProblemaEstado = 'intentado' | 'resuelto';

export interface ProblemaProgress {
  estado: ProblemaEstado;
  intentos: number;
  /** ISO date del último cambio */
  fecha: string;
}

export interface ActividadProgress {
  /** yyyy-mm-dd de la última visita registrada */
  ultimaVisita: string;
  /** Días activos únicos (orden ascendente, acotado a 365) */
  dias: string[];
  /** Días consecutivos hasta hoy */
  rachaActual: number;
  /** Récord histórico de racha */
  rachaMejor: number;
}

export interface ProgressData {
  /** Versión del esquema, para migraciones futuras */
  v: number;
  /** id de tema (`categoria/slug`) → timestamp ms de lectura (truthy = leído) */
  temas: Record<string, number>;
  /** id de problema (slug) → estado */
  problemas: Record<string, ProblemaProgress>;
  /** Marcadores; se envían vacíos en v1 para no migrar al añadirlos */
  favoritos: { temas: string[]; problemas: string[] };
  /** Señal de actividad para la racha de estudio */
  actividad: ActividadProgress;
}

export function progresoVacio(): ProgressData {
  return {
    v: PROGRESS_VERSION,
    temas: {},
    problemas: {},
    favoritos: { temas: [], problemas: [] },
    actividad: { ultimaVisita: '', dias: [], rachaActual: 0, rachaMejor: 0 },
  };
}
