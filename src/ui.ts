/**
 * Textos del "chrome" del sitio (navegación, etiquetas compartidas,
 * estados vacíos…) centralizados y tipados.
 *
 * Para añadir inglés en el futuro: define `export const en: UIStrings`,
 * activa i18n en astro.config.mjs y resuelve `t` según el locale
 * (mismo patrón que el proyecto consulting). El copy largo de cada
 * página vive en la propia página; al internacionalizar, muévelo aquí.
 */

export interface UIStrings {
  meta: {
    ogAlt: string;
  };
  nav: {
    temas: string;
    problemas: string;
    quiz: string;
    glosario: string;
    recursos: string;
    progreso: string;
    sobre: string;
    skip: string;
    ariaMain: string;
    ariaToggle: string;
    ariaTheme: string;
  };
  labels: {
    dificultad: Record<'facil' | 'medio' | 'dificil', string>;
    nivel: Record<'fundamentos' | 'intermedio' | 'avanzado', string>;
    tipoRecurso: Record<
      'documentacion' | 'libro' | 'curso' | 'video' | 'herramienta' | 'articulo',
      string
    >;
    minLectura: (min: number) => string;
    actualizado: string;
    temasCount: (n: number) => string;
    problemasCount: (n: number) => string;
    preguntasCount: (n: number) => string;
    verTodo: string;
    volver: string;
    anterior: string;
    siguiente: string;
    enEstaPagina: string;
    gratis: string;
    enIngles: string;
  };
  empty: {
    categoriaSinTemas: string;
    categoriaSinTemasSub: string;
    proximamente: string;
    sinResultados: string;
    sinResultadosSub: string;
  };
  progreso: {
    eyebrow: string;
    titulo: string;
    sub: string;
    /** Botones de marcar en las páginas de detalle */
    marcarLeido: string;
    leido: string;
    marcarResuelto: string;
    resuelto: string;
    intentado: string;
    /** Panel */
    global: string;
    completado: (pct: number) => string;
    temasLeidos: (n: number, total: number) => string;
    problemasResueltos: (n: number, total: number) => string;
    mejorQuiz: (pct: number) => string;
    sinQuiz: string;
    racha: string;
    rachaDias: (n: number) => string;
    rachaRecord: (n: number) => string;
    reiniciar: string;
    reiniciarConfirm: string;
    vacio: string;
    vacioSub: string;
    vacioCta: string;
    privacidad: string;
  };
  footer: {
    tagline: string;
    secciones: string;
    categorias: string;
    hecho: string;
  };
}

export const es: UIStrings = {
  meta: {
    ogAlt: 'DevAtlas — Atlas de conocimiento de ingeniería de software',
  },
  nav: {
    temas: 'Temas',
    problemas: 'Problemas',
    quiz: 'Quiz',
    glosario: 'Glosario',
    recursos: 'Recursos',
    progreso: 'Progreso',
    sobre: 'Sobre',
    skip: 'Saltar al contenido',
    ariaMain: 'Navegación principal',
    ariaToggle: 'Abrir o cerrar el menú',
    ariaTheme: 'Cambiar tema claro/oscuro',
  },
  labels: {
    dificultad: { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' },
    nivel: { fundamentos: 'Fundamentos', intermedio: 'Intermedio', avanzado: 'Avanzado' },
    tipoRecurso: {
      documentacion: 'Documentación',
      libro: 'Libro',
      curso: 'Curso',
      video: 'Vídeo',
      herramienta: 'Herramienta',
      articulo: 'Artículo',
    },
    minLectura: (min) => `${min} min de lectura`,
    actualizado: 'Actualizado',
    temasCount: (n) => `${n} ${n === 1 ? 'tema' : 'temas'}`,
    problemasCount: (n) => `${n} ${n === 1 ? 'problema' : 'problemas'}`,
    preguntasCount: (n) => `${n} ${n === 1 ? 'pregunta' : 'preguntas'}`,
    verTodo: 'Ver todo',
    volver: 'Volver',
    anterior: 'Anterior',
    siguiente: 'Siguiente',
    enEstaPagina: 'En esta página',
    gratis: 'Gratis',
    enIngles: 'EN',
  },
  empty: {
    categoriaSinTemas: 'Aún no hay temas en esta categoría',
    categoriaSinTemasSub: 'Estamos preparando el contenido. Vuelve pronto.',
    proximamente: 'Próximamente',
    sinResultados: 'Ningún resultado con esos filtros',
    sinResultadosSub: 'Prueba a quitar algún filtro.',
  },
  progreso: {
    eyebrow: 'Tu recorrido',
    titulo: 'Progreso',
    sub: 'Todo se guarda en este navegador — nada se envía a ningún servidor. Marca temas como leídos y problemas como resueltos para verlo aquí.',
    marcarLeido: 'Marcar como leído',
    leido: 'Leído',
    marcarResuelto: 'Marcar como resuelto',
    resuelto: 'Resuelto',
    intentado: 'Intentado',
    global: 'Completado',
    completado: (pct) => `${pct}% completado`,
    temasLeidos: (n, total) => `${n}/${total} leídos`,
    problemasResueltos: (n, total) => `${n}/${total} resueltos`,
    mejorQuiz: (pct) => `Quiz: ${pct}%`,
    sinQuiz: 'Quiz: —',
    racha: 'Racha de estudio',
    rachaDias: (n) => `${n} ${n === 1 ? 'día' : 'días'}`,
    rachaRecord: (n) => `récord: ${n}`,
    reiniciar: 'Reiniciar progreso',
    reiniciarConfirm:
      '¿Seguro que quieres borrar todo tu progreso (temas, problemas y quiz)? No se puede deshacer.',
    vacio: 'Aún no has guardado progreso',
    vacioSub: 'Lee un tema o resuelve un problema y aquí verás tu avance por categoría.',
    vacioCta: 'Explorar temas',
    privacidad: 'Todo se guarda solo en este navegador; nada se envía a ningún servidor.',
  },
  footer: {
    tagline: 'Atlas de conocimiento de ingeniería de software, en español.',
    secciones: 'Secciones',
    categorias: 'Categorías',
    hecho: 'Hecho con Astro · Desplegado en Cloudflare',
  },
};

/** Idioma activo (único por ahora) */
export const t = es;
