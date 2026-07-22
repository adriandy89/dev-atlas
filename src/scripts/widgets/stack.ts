/**
 * Widget: pila (LIFO). push apila arriba, pop saca la cima.
 * Uso en markdown:  <div data-widget="stack"></div>
 */
const ETIQUETAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MAX = 6;

export function mount(el: HTMLElement): void {
  el.classList.add('w-frame');
  el.innerHTML = `
    <div class="w-stack-viz" data-viz role="list" aria-label="Pila (LIFO)"></div>
    <p class="w-estado" aria-live="polite" data-estado></p>
    <div class="w-controls">
      <button type="button" class="btn btn-ghost btn-sm" data-push>Apilar (push)</button>
      <button type="button" class="btn btn-ghost btn-sm" data-pop>Desapilar (pop)</button>
      <button type="button" class="btn btn-ghost btn-sm" data-reset>Reiniciar</button>
    </div>`;

  const viz = el.querySelector<HTMLElement>('[data-viz]')!;
  const estado = el.querySelector<HTMLElement>('[data-estado]')!;
  const pila: string[] = [];
  let i = 0;

  function pinta(nota: string, nuevoTop = false) {
    viz.replaceChildren(
      ...pila.map((v, idx) => {
        const c = document.createElement('div');
        c.className = 'w-cell' + (idx === pila.length - 1 ? ' is-top' : '');
        c.setAttribute('role', 'listitem');
        c.textContent = v;
        return c;
      }),
    );
    if (nuevoTop && viz.lastElementChild) viz.lastElementChild.classList.add('is-entrando');
    estado.innerHTML = nota;
  }

  el.querySelector('[data-push]')!.addEventListener('click', () => {
    if (pila.length >= MAX) {
      estado.innerHTML = `Pila llena (máx. ${MAX} en la demo).`;
      return;
    }
    const v = ETIQUETAS[i % ETIQUETAS.length] + (i >= ETIQUETAS.length ? Math.floor(i / ETIQUETAS.length) : '');
    i++;
    pila.push(v);
    pinta(`<b>push("${v}")</b> → la cima ahora es "${v}".`, true);
  });

  el.querySelector('[data-pop]')!.addEventListener('click', () => {
    if (pila.length === 0) {
      estado.innerHTML = 'La pila está vacía: nada que desapilar.';
      return;
    }
    const v = pila.pop();
    pinta(
      pila.length
        ? `<b>pop()</b> → sale "${v}". La cima ahora es "${pila[pila.length - 1]}".`
        : `<b>pop()</b> → sale "${v}". Pila vacía.`,
    );
  });

  el.querySelector('[data-reset]')!.addEventListener('click', () => {
    pila.length = 0;
    i = 0;
    pinta('Pila vacía.');
  });

  pinta('Pila vacía. Solo puedes tocar la <b>cima</b>: esa es la restricción LIFO.');
}
