/**
 * Tipos compartidos entre el servidor (páginas que incrustan el pool
 * de preguntas como JSON) y el cliente (la isla vanilla `quiz.ts`).
 */

export type QuizDificultad = 'facil' | 'medio' | 'dificil';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  /** Índice (desde 0) de la opción correcta */
  correct: number;
  explanation: string;
  difficulty: QuizDificultad;
}

export interface QuizCategoryStats {
  intentos: number;
  /** Mejor puntuación en % (0-100) */
  mejor: number;
  /** Última puntuación en % (0-100) */
  ultima: number;
  /** ISO date del último intento */
  fecha: string;
}

export interface QuizStats {
  categorias: Record<string, QuizCategoryStats>;
  /** Aciertos consecutivos acumulados entre sesiones */
  racha: { actual: number; mejor: number };
}

export const QUIZ_STORAGE_KEY = 'devatlas.quiz.v1';
