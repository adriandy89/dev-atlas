/**
 * Helpers del progreso del usuario (solo navegador, sin frameworks).
 *
 * Igual que `quiz.ts`: todo acceso a localStorage va envuelto en try/catch y
 * degrada en silencio (modo privado, cuota agotada…). NO hay acceso a
 * localStorage a nivel de módulo, así que es seguro importar sus TIPOS desde
 * el frontmatter de un `.astro`; estas funciones solo se invocan dentro de un
 * `<script>` de cliente.
 */
import {
  PROGRESS_STORAGE_KEY,
  PROGRESS_VERSION,
  progresoVacio,
  type ProblemaEstado,
  type ProgressData,
} from './progress-types';
import { QUIZ_STORAGE_KEY } from './quiz-types';

const MAX_DIAS = 365;

/** Normaliza datos guardados a la forma actual (tolerante a datos parciales). */
function migrar(raw: unknown): ProgressData {
  if (!raw || typeof raw !== 'object') return progresoVacio();
  const base = progresoVacio();
  const r = raw as Partial<ProgressData>;
  return {
    v: PROGRESS_VERSION,
    temas: { ...base.temas, ...(r.temas ?? {}) },
    problemas: { ...base.problemas, ...(r.problemas ?? {}) },
    favoritos: {
      temas: r.favoritos?.temas ?? base.favoritos.temas,
      problemas: r.favoritos?.problemas ?? base.favoritos.problemas,
    },
    actividad: { ...base.actividad, ...(r.actividad ?? {}) },
  };
}

export function getProgreso(): ProgressData {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) return migrar(JSON.parse(raw));
  } catch {
    /* localStorage no disponible o corrupto: empezar de cero */
  }
  return progresoVacio();
}

function guardar(data: ProgressData): ProgressData {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* sin persistencia: la sesión sigue funcionando en memoria */
  }
  return data;
}

/** Marca (o desmarca) un tema como leído. */
export function marcarTema(id: string, leido: boolean): ProgressData {
  const data = getProgreso();
  if (leido) data.temas[id] = Date.now();
  else delete data.temas[id];
  return guardar(data);
}

/** Visita pasiva a un problema: registra 'intentado' solo si no había nada. */
export function registrarIntento(id: string): ProgressData {
  const data = getProgreso();
  if (!data.problemas[id]) {
    data.problemas[id] = { estado: 'intentado', intentos: 1, fecha: new Date().toISOString() };
    return guardar(data);
  }
  return data;
}

/** Acción explícita del usuario (botón): fija el estado o lo limpia (null). */
export function marcarProblema(id: string, estado: ProblemaEstado | null): ProgressData {
  const data = getProgreso();
  if (estado === null) {
    delete data.problemas[id];
  } else {
    const previo = data.problemas[id];
    data.problemas[id] = {
      estado,
      intentos: previo?.intentos ?? 1,
      fecha: new Date().toISOString(),
    };
  }
  return guardar(data);
}

export function alternarFavorito(tipo: 'temas' | 'problemas', id: string): ProgressData {
  const data = getProgreso();
  const lista = data.favoritos[tipo];
  const i = lista.indexOf(id);
  if (i >= 0) lista.splice(i, 1);
  else lista.push(id);
  return guardar(data);
}

function formatearDia(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function diaAnterior(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return formatearDia(d);
}

/**
 * Registra la visita de hoy y recalcula la racha de estudio (días
 * consecutivos). Idempotente por día: no hace nada si ya se contó hoy.
 */
export function registrarActividad(): ProgressData {
  const data = getProgreso();
  const hoy = formatearDia(new Date());
  if (data.actividad.ultimaVisita === hoy) return data;

  if (!data.actividad.dias.includes(hoy)) {
    data.actividad.dias.push(hoy);
    data.actividad.dias.sort();
    if (data.actividad.dias.length > MAX_DIAS) {
      data.actividad.dias = data.actividad.dias.slice(-MAX_DIAS);
    }
  }

  const set = new Set(data.actividad.dias);
  let racha = 0;
  let cursor = hoy;
  while (set.has(cursor)) {
    racha++;
    cursor = diaAnterior(cursor);
  }
  data.actividad.rachaActual = racha;
  data.actividad.rachaMejor = Math.max(data.actividad.rachaMejor, racha);
  data.actividad.ultimaVisita = hoy;
  return guardar(data);
}

/** Borra TODO el progreso (progreso + estadísticas del quiz). */
export function reiniciarProgreso(): void {
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  } catch {
    /* nada que hacer */
  }
}
