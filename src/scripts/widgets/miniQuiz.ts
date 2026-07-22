/**
 * Widget: mini-quiz "Comprueba lo que sabes".
 * Uso:  <div data-widget="mini-quiz" data-count="3" data-difficulty="facil"></div>
 * Reutiliza el pool de preguntas de la categoría, incrustado por la página en
 * <script type="application/json" data-preguntas-pool>. No crea contenido nuevo.
 */
import type { QuizQuestion } from '../../lib/quiz-types';

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

function barajar<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function mount(el: HTMLElement): void {
  const poolEl = document.querySelector('[data-preguntas-pool]');
  let pool: QuizQuestion[] = [];
  try {
    pool = JSON.parse(poolEl?.textContent ?? '[]');
  } catch {
    /* sin pool: no montar */
  }
  if (pool.length === 0) return;

  const count = Math.min(Math.max(parseInt(el.dataset.count ?? '3', 10) || 3, 1), 10);
  const dif = el.dataset.difficulty;
  let seleccion = dif ? pool.filter((q) => q.difficulty === dif) : [...pool];
  if (seleccion.length === 0) seleccion = [...pool];
  seleccion = barajar(seleccion).slice(0, Math.min(count, seleccion.length));

  el.classList.add('w-frame', 'w-miniquiz');
  const titulo = document.createElement('p');
  titulo.className = 'w-miniquiz-titulo';
  titulo.textContent = 'Comprueba lo que sabes';
  const lista = document.createElement('ol');
  lista.className = 'w-mq-lista';

  for (const q of seleccion) {
    const item = document.createElement('li');
    item.className = 'w-mq-item';

    const preg = document.createElement('p');
    preg.className = 'w-mq-pregunta';
    preg.textContent = q.question;

    const opciones = document.createElement('div');
    opciones.className = 'w-mq-opciones';

    const feedback = document.createElement('p');
    feedback.className = 'w-mq-feedback';
    feedback.setAttribute('aria-live', 'polite');

    let respondida = false;
    q.options.forEach((texto, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'w-mq-opt';
      const letra = document.createElement('span');
      letra.className = 'q-opt-letra';
      letra.textContent = LETRAS[i];
      const t = document.createElement('span');
      t.textContent = texto;
      btn.append(letra, t);
      btn.addEventListener('click', () => {
        if (respondida) return;
        respondida = true;
        opciones.querySelectorAll<HTMLButtonElement>('.w-mq-opt').forEach((b, j) => {
          b.disabled = true;
          if (j === q.correct) b.classList.add('is-correct');
          else if (j === i) b.classList.add('is-wrong');
        });
        const ok = i === q.correct;
        feedback.textContent = (ok ? '✓ Correcto. ' : `✗ La respuesta era ${LETRAS[q.correct]}. `) + q.explanation;
      });
      opciones.append(btn);
    });

    item.append(preg, opciones, feedback);
    lista.append(item);
  }

  el.replaceChildren(titulo, lista);
}
