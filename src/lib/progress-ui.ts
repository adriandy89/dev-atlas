/**
 * Isla compartida de las acciones de progreso (marcar leído / resuelto).
 *
 * Igual que `quiz.ts`, este <script> se comparte entre páginas: no contiene
 * datos de ninguna página. Lee su objetivo del DOM (data-kind / data-id) y los
 * textos de los botones de sus data-* (evita meter `ui.ts` en el bundle de
 * cliente). Toda persistencia degrada en silencio (ver `progress.ts`).
 */
import {
  getProgreso,
  marcarProblema,
  marcarTema,
  registrarActividad,
  registrarIntento,
} from './progress';

export function initProgresoAcciones() {
  // Cada visita a un artículo/problema cuenta para la racha de estudio.
  registrarActividad();

  const root = document.querySelector<HTMLElement>('[data-progress-accion]');
  if (!root) return;

  const kind = root.dataset.kind; // 'tema' | 'problema'
  const id = root.dataset.id;
  const btn = root.querySelector<HTMLButtonElement>('[data-toggle]');
  if (!kind || !id || !btn) return;

  const boton = btn;
  const label = root.querySelector<HTMLElement>('[data-label]');
  const textoIdle = boton.dataset.labelIdle ?? '';
  const textoDone = boton.dataset.labelDone ?? '';

  // Abrir un problema cuenta como intento pasivo (no degrada 'resuelto').
  if (kind === 'problema') registrarIntento(id);

  const estaHecho = (): boolean => {
    const p = getProgreso();
    return kind === 'tema' ? Boolean(p.temas[id]) : p.problemas[id]?.estado === 'resuelto';
  };

  const pintar = () => {
    const hecho = estaHecho();
    boton.setAttribute('aria-pressed', String(hecho));
    boton.classList.toggle('is-done', hecho);
    if (label && textoIdle) label.textContent = hecho ? textoDone : textoIdle;
  };

  pintar();

  boton.addEventListener('click', () => {
    const hecho = estaHecho();
    if (kind === 'tema') marcarTema(id, !hecho);
    else marcarProblema(id, hecho ? 'intentado' : 'resuelto');
    pintar();
  });
}
