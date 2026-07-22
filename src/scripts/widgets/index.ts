/**
 * Cargador de widgets de artículo.
 *
 * Recorre `.prose [data-widget]` y carga cada módulo BAJO DEMANDA (`import()`
 * dinámico): una página solo descarga el JS de los widgets que contiene. Si un
 * módulo falla o no hay JS, el contenido estático del `<div>` permanece.
 *
 * Registro = único sitio donde se declara un widget nuevo. Los widgets sin JS
 * (Big-O, diagramas, callouts) NO van aquí: son HTML/SVG/CSS puro.
 */
import type { WidgetModule } from '../../lib/widget-types';

const REGISTRO: Record<string, () => Promise<WidgetModule>> = {
  'binary-search': () => import('./binarySearch'),
  stack: () => import('./stack'),
  queue: () => import('./queue'),
  'hash-table': () => import('./hashTable'),
  'mini-quiz': () => import('./miniQuiz'),
  sorting: () => import('./sorting'),
};

export function initWidgets(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('.prose [data-widget]').forEach((el) => {
    if (el.dataset.mounted) return;
    const carga = REGISTRO[el.dataset.widget ?? ''];
    if (!carga) return;
    el.dataset.mounted = 'true';
    carga()
      .then((m) => m.mount(el))
      .catch(() => {
        // Fallo de red/módulo: revertir para permitir reintento y no ocultar
        // el fallback estático que el autor dejó dentro del <div>.
        delete el.dataset.mounted;
      });
  });
}
