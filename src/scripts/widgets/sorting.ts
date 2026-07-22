/**
 * Widget: visualizador de ordenación por burbuja, paso a paso.
 * Uso en markdown:  <div data-widget="sorting" data-array="5,2,8,1,9,4"></div>
 *
 * Cada paso compara un par adyacente y lo intercambia si está en desorden;
 * al final de cada pasada el máximo "burbujea" a su posición definitiva
 * (se pinta en verde). "Auto" reproduce los pasos; con reduced-motion las
 * barras cambian sin transición (CSS) pero el widget funciona igual.
 */
import { prefiereMenosMovimiento } from '../../lib/widget-types';

const ARRAY_DEFECTO = [5, 2, 8, 1, 9, 4, 7, 3];

export function mount(el: HTMLElement): void {
  const original = (el.dataset.array ?? '')
    .split(',')
    .map((n) => parseInt(n.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, 10);
  const base = original.length >= 3 ? original : ARRAY_DEFECTO;

  el.classList.add('w-frame', 'w-sort');
  el.innerHTML = `
    <div class="w-sort-viz" data-viz aria-hidden="true"></div>
    <p class="w-estado" aria-live="polite" data-estado></p>
    <div class="w-controls">
      <button type="button" class="btn btn-ghost btn-sm" data-paso>Paso</button>
      <button type="button" class="btn btn-ghost btn-sm" data-auto>Auto</button>
      <button type="button" class="btn btn-ghost btn-sm" data-reset>Reiniciar</button>
    </div>`;

  const viz = el.querySelector<HTMLElement>('[data-viz]')!;
  const estado = el.querySelector<HTMLElement>('[data-estado]')!;
  const btnPaso = el.querySelector<HTMLButtonElement>('[data-paso]')!;
  const btnAuto = el.querySelector<HTMLButtonElement>('[data-auto]')!;
  const max = Math.max(...base);

  let arr: number[] = [];
  let i = 0; // pasada actual (cuántos ya están colocados al final)
  let j = 0; // índice del par que toca comparar
  let cambiosEnPasada = false;
  let hecho = false;
  let timer = 0;
  let comparaciones = 0;
  let intercambios = 0;

  function pinta(compara = -1, intercambio = false) {
    viz.replaceChildren(
      ...arr.map((v, idx) => {
        const bar = document.createElement('div');
        bar.className = 'w-sort-bar';
        if (hecho || idx >= arr.length - i) bar.classList.add('is-sorted');
        if (!hecho && (idx === compara || idx === compara + 1)) {
          bar.classList.add(intercambio ? 'is-swap' : 'is-compara');
        }
        bar.style.setProperty('--h', `${Math.round((v / max) * 100)}%`);
        const label = document.createElement('span');
        label.textContent = String(v);
        bar.append(label);
        return bar;
      }),
    );
  }

  function paraAuto() {
    if (timer) {
      clearInterval(timer);
      timer = 0;
      btnAuto.textContent = 'Auto';
    }
  }

  function paso() {
    if (hecho) return;

    // ¿Terminó la pasada actual?
    if (j >= arr.length - 1 - i) {
      if (!cambiosEnPasada || i >= arr.length - 2) {
        hecho = true;
        i = arr.length;
        paraAuto();
        pinta();
        estado.innerHTML = `<b>Ordenado</b> en ${comparaciones} comparaciones y ${intercambios} intercambios. Sin cambios en una pasada → no queda nada por hacer.`;
        return;
      }
      i++;
      j = 0;
      cambiosEnPasada = false;
      pinta();
      estado.innerHTML = `Fin de la pasada ${i}: el mayor pendiente ya <b>burbujeó</b> a su sitio (verde). Empieza otra pasada.`;
      return;
    }

    comparaciones++;
    const a = arr[j];
    const b = arr[j + 1];
    const intercambia = a > b;
    if (intercambia) {
      arr[j] = b;
      arr[j + 1] = a;
      intercambios++;
      cambiosEnPasada = true;
    }
    pinta(j, intercambia);
    estado.innerHTML = intercambia
      ? `Compara <b>${a}</b> y <b>${b}</b>: están en desorden → <b>intercambio</b>.`
      : `Compara <b>${a}</b> y <b>${b}</b>: ya están en orden → no toca nada.`;
    j++;
  }

  function reinicia() {
    paraAuto();
    arr = [...base];
    i = 0;
    j = 0;
    cambiosEnPasada = false;
    hecho = false;
    comparaciones = 0;
    intercambios = 0;
    pinta();
    estado.innerHTML =
      'Pulsa <b>Paso</b> para comparar el primer par, o <b>Auto</b> para verlo entero.';
  }

  btnPaso.addEventListener('click', () => {
    paraAuto();
    paso();
  });

  btnAuto.addEventListener('click', () => {
    if (timer) {
      paraAuto();
      return;
    }
    if (hecho) reinicia();
    btnAuto.textContent = 'Pausa';
    const ritmo = prefiereMenosMovimiento() ? 900 : 550;
    timer = window.setInterval(paso, ritmo);
  });

  el.querySelector('[data-reset]')!.addEventListener('click', reinicia);

  reinicia();
}
