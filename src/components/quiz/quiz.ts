/**
 * Lógica de la isla del quiz (vanilla, sin frameworks).
 *
 * IMPORTANTE: Astro empaqueta los <script> procesados UNA vez por módulo y
 * los comparte entre páginas — por eso este código no contiene datos de
 * ninguna página: lee el pool de preguntas del <script type="application/json">
 * que incrusta Quiz.astro en el DOM de cada página.
 */
import {
  QUIZ_STORAGE_KEY,
  type QuizQuestion,
  type QuizStats,
} from '../../lib/quiz-types';

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

function barajar<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function leerStats(): QuizStats {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as QuizStats;
  } catch {
    /* localStorage no disponible o corrupto: empezar de cero */
  }
  return { categorias: {}, racha: { actual: 0, mejor: 0 } };
}

function guardarStats(stats: QuizStats) {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    /* sin persistencia: el quiz funciona igual */
  }
}

export function initQuiz() {
  const root = document.querySelector<HTMLElement>('[data-quiz]');
  if (!root) return;

  const pool: QuizQuestion[] = JSON.parse(
    root.querySelector('script[data-quiz-data]')?.textContent ?? '[]',
  );
  const categoria = root.dataset.categoria ?? '';

  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const pantallas = {
    setup: $('[data-pantalla="setup"]'),
    juego: $('[data-pantalla="juego"]'),
    resultado: $('[data-pantalla="resultado"]'),
  };
  const el = {
    aviso: $('[data-aviso]'),
    contador: $('[data-contador]'),
    barra: $('[data-barra]'),
    barraRelleno: $('[data-barra-relleno]'),
    enunciado: $('[data-enunciado]'),
    opciones: $('[data-opciones]'),
    feedback: $('[data-feedback]'),
    siguiente: $<HTMLButtonElement>('[data-accion="siguiente"]'),
    score: $('[data-score]'),
    mensaje: $('[data-mensaje]'),
    marcas: $('[data-marcas]'),
    falladasTitulo: $('[data-falladas-titulo]'),
    falladas: $('[data-falladas]'),
  };

  let ronda: QuizQuestion[] = [];
  let indice = 0;
  let aciertos = 0;
  let falladas: QuizQuestion[] = [];
  let respondida = false;

  function mostrar(nombre: keyof typeof pantallas) {
    for (const [clave, pantalla] of Object.entries(pantallas)) {
      pantalla.hidden = clave !== nombre;
    }
  }

  function empezar() {
    const dificultad =
      root!.querySelector<HTMLInputElement>('input[name="dificultad"]:checked')?.value ?? '';
    const cantidadRaw =
      root!.querySelector<HTMLInputElement>('input[name="cantidad"]:checked')?.value ?? 'todas';
    const conBarajado =
      root!.querySelector<HTMLInputElement>('input[name="barajar"]')?.checked ?? true;

    let seleccion = dificultad ? pool.filter((q) => q.difficulty === dificultad) : [...pool];
    if (seleccion.length === 0) {
      el.aviso.hidden = false;
      return;
    }
    el.aviso.hidden = true;

    if (conBarajado) seleccion = barajar(seleccion);
    const cantidad =
      cantidadRaw === 'todas'
        ? seleccion.length
        : Math.min(parseInt(cantidadRaw, 10), seleccion.length);

    ronda = seleccion.slice(0, cantidad).map((q) => {
      if (!conBarajado) return q;
      // Barajar también las opciones, remapeando el índice de la correcta
      const orden = barajar(q.options.map((_, i) => i));
      return { ...q, options: orden.map((i) => q.options[i]), correct: orden.indexOf(q.correct) };
    });

    indice = 0;
    aciertos = 0;
    falladas = [];
    mostrar('juego');
    pintarPregunta();
  }

  function pintarPregunta() {
    respondida = false;
    const q = ronda[indice];

    el.contador.textContent = `Pregunta ${indice + 1} de ${ronda.length}`;
    const pct = Math.round((indice / ronda.length) * 100);
    el.barra.setAttribute('aria-valuenow', String(pct));
    el.barraRelleno.style.width = `${pct}%`;

    el.enunciado.textContent = q.question;
    el.feedback.className = 'q-feedback';
    el.feedback.replaceChildren();
    el.siguiente.hidden = true;

    el.opciones.replaceChildren(
      ...q.options.map((opcion, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-opt';

        const letra = document.createElement('span');
        letra.className = 'q-opt-letra';
        letra.textContent = LETRAS[i];

        const texto = document.createElement('span');
        texto.className = 'q-opt-texto';
        texto.textContent = opcion;

        const marca = document.createElement('span');
        marca.className = 'q-opt-marca';
        marca.setAttribute('aria-hidden', 'true');

        btn.append(letra, texto, marca);
        btn.addEventListener('click', () => responder(i));
        return btn;
      }),
    );

    // El foco va al enunciado: el lector de pantalla anuncia la nueva pregunta
    el.enunciado.focus();
  }

  function responder(elegida: number) {
    if (respondida) return;
    respondida = true;
    const q = ronda[indice];
    const acierto = elegida === q.correct;

    el.opciones.querySelectorAll<HTMLButtonElement>('.q-opt').forEach((btn, i) => {
      btn.disabled = true;
      const marca = btn.querySelector('.q-opt-marca');
      if (i === q.correct) {
        btn.classList.add('is-correct');
        if (marca) marca.textContent = '✓';
      } else if (i === elegida) {
        btn.classList.add('is-wrong');
        if (marca) marca.textContent = '✗';
      }
    });

    if (acierto) aciertos++;
    else falladas.push(q);

    // Racha de aciertos persistente entre sesiones
    const stats = leerStats();
    if (acierto) {
      stats.racha.actual++;
      stats.racha.mejor = Math.max(stats.racha.mejor, stats.racha.actual);
    } else {
      stats.racha.actual = 0;
    }
    guardarStats(stats);

    el.feedback.classList.add(acierto ? 'is-ok' : 'is-ko');
    const titulo = document.createElement('p');
    titulo.className = 'q-feedback-titulo';
    titulo.textContent = acierto
      ? 'Correcto.'
      : `Incorrecto. La respuesta era ${LETRAS[q.correct]}.`;
    const explicacion = document.createElement('p');
    explicacion.className = 'q-feedback-explicacion';
    explicacion.textContent = q.explanation;
    el.feedback.replaceChildren(titulo, explicacion);

    el.siguiente.textContent = indice + 1 < ronda.length ? 'Siguiente' : 'Ver resultado';
    el.siguiente.hidden = false;
    el.siguiente.focus();
  }

  function avanzar() {
    if (!respondida) return;
    if (indice + 1 < ronda.length) {
      indice++;
      pintarPregunta();
    } else {
      terminar();
    }
  }

  function terminar() {
    const total = ronda.length;
    const pct = Math.round((aciertos / total) * 100);

    el.score.textContent = `${aciertos} de ${total} · ${pct}%`;
    el.mensaje.textContent =
      pct === 100
        ? '¡Perfecto! Dominas esta categoría.'
        : pct >= 70
          ? 'Muy bien. Repasa las falladas y lo tienes.'
          : pct >= 40
            ? 'Buen comienzo — los temas de esta categoría te ayudarán a afianzarlo.'
            : 'No pasa nada: lee los temas de la categoría y vuelve a intentarlo.';

    const stats = leerStats();
    const previa = stats.categorias[categoria];
    stats.categorias[categoria] = {
      intentos: (previa?.intentos ?? 0) + 1,
      mejor: Math.max(previa?.mejor ?? 0, pct),
      ultima: pct,
      fecha: new Date().toISOString(),
    };
    guardarStats(stats);

    const marcas: string[] = [];
    if (previa) marcas.push(`Mejor marca: ${Math.max(previa.mejor, pct)}%`);
    if (stats.racha.mejor > 0) {
      marcas.push(`Racha de aciertos: ${stats.racha.actual} (récord: ${stats.racha.mejor})`);
    }
    el.marcas.textContent = marcas.join(' · ');

    el.falladasTitulo.hidden = falladas.length === 0;
    el.falladas.replaceChildren(
      ...falladas.map((q) => {
        const item = document.createElement('div');
        item.className = 'q-fallada';
        const pregunta = document.createElement('p');
        pregunta.className = 'q-fallada-pregunta';
        pregunta.textContent = q.question;
        const respuesta = document.createElement('p');
        respuesta.className = 'q-fallada-respuesta';
        respuesta.textContent = `Respuesta: ${q.options[q.correct]}`;
        item.append(pregunta, respuesta);
        return item;
      }),
    );

    mostrar('resultado');
    el.score.focus();
  }

  // Acciones
  root.querySelector('[data-accion="empezar"]')?.addEventListener('click', empezar);
  el.siguiente.addEventListener('click', avanzar);
  root.querySelector('[data-accion="repetir"]')?.addEventListener('click', empezar);
  root
    .querySelector('[data-accion="configurar"]')
    ?.addEventListener('click', () => mostrar('setup'));

  // Teclado: 1-6 selecciona opción; Enter avanza tras responder
  root.addEventListener('keydown', (ev) => {
    if (pantallas.juego.hidden) return;
    if (ev.key >= '1' && ev.key <= '6') {
      const btn = el.opciones.querySelectorAll<HTMLButtonElement>('.q-opt')[
        parseInt(ev.key, 10) - 1
      ];
      if (btn && !btn.disabled) {
        ev.preventDefault();
        btn.click();
      }
    } else if (ev.key === 'Enter' && respondida && document.activeElement !== el.siguiente) {
      // (con el foco en "Siguiente", el click nativo ya avanza)
      ev.preventDefault();
      avanzar();
    }
  });
}
