/**
 * Widget: cola (FIFO). enqueue añade al final, dequeue saca del frente.
 * Uso en markdown:  <div data-widget="queue"></div>
 */
const ETIQUETAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const MAX = 6;

export function mount(el: HTMLElement): void {
  el.classList.add('w-frame');
  el.innerHTML = `
    <div class="w-queue-viz" data-viz role="list" aria-label="Cola (FIFO)"></div>
    <p class="w-estado" aria-live="polite" data-estado></p>
    <div class="w-controls">
      <button type="button" class="btn btn-ghost btn-sm" data-enq>Encolar (enqueue)</button>
      <button type="button" class="btn btn-ghost btn-sm" data-deq>Desencolar (dequeue)</button>
      <button type="button" class="btn btn-ghost btn-sm" data-reset>Reiniciar</button>
    </div>`;

  const viz = el.querySelector<HTMLElement>('[data-viz]')!;
  const estado = el.querySelector<HTMLElement>('[data-estado]')!;
  const cola: string[] = [];
  let i = 0;

  function pinta(nota: string, nuevoFinal = false) {
    viz.replaceChildren(
      ...cola.map((v, idx) => {
        const c = document.createElement('div');
        c.className = 'w-cell';
        if (idx === 0) c.classList.add('is-front');
        if (idx === cola.length - 1 && cola.length > 1) c.classList.add('is-back');
        c.setAttribute('role', 'listitem');
        c.textContent = v;
        return c;
      }),
    );
    if (nuevoFinal && viz.lastElementChild) viz.lastElementChild.classList.add('is-entrando');
    estado.innerHTML = nota;
  }

  el.querySelector('[data-enq]')!.addEventListener('click', () => {
    if (cola.length >= MAX) {
      estado.innerHTML = `Cola llena (máx. ${MAX} en la demo).`;
      return;
    }
    const v = ETIQUETAS[i % ETIQUETAS.length] + (i >= ETIQUETAS.length ? Math.floor(i / ETIQUETAS.length) : '');
    i++;
    cola.push(v);
    pinta(`<b>enqueue("${v}")</b> → entra por el final.`, true);
  });

  el.querySelector('[data-deq]')!.addEventListener('click', () => {
    if (cola.length === 0) {
      estado.innerHTML = 'La cola está vacía: nada que desencolar.';
      return;
    }
    const v = cola.shift();
    pinta(
      cola.length
        ? `<b>dequeue()</b> → sale "${v}" (el primero que entró). El frente ahora es "${cola[0]}".`
        : `<b>dequeue()</b> → sale "${v}". Cola vacía.`,
    );
  });

  el.querySelector('[data-reset]')!.addEventListener('click', () => {
    cola.length = 0;
    i = 0;
    pinta('Cola vacía.');
  });

  pinta('Cola vacía. Entra por el <b>final</b> y sale por el <b>frente</b>: esa es la restricción FIFO.');
}
