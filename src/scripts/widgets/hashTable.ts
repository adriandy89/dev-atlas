/**
 * Widget: tabla hash con encadenamiento.
 * Uso:  <div data-widget="hash-table" data-buckets="8"></div>
 * Muestra hash(clave) % N, las colisiones encadenadas y el factor de carga.
 */
const EJEMPLOS = ['rojo', 'azul', 'verde', 'gris', 'lila', 'ocre', 'cian', 'rosa', 'oro', 'jade'];

function hash(clave: string, n: number): number {
  let h = 0;
  for (const ch of clave) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % n;
}

export function mount(el: HTMLElement): void {
  const n = Math.min(Math.max(parseInt(el.dataset.buckets ?? '8', 10) || 8, 4), 12);
  const cubos: string[][] = Array.from({ length: n }, () => []);
  let total = 0;
  let sugerencia = 0;

  el.classList.add('w-frame', 'w-hash');
  el.innerHTML = `
    <div class="w-hash-input">
      <input type="text" data-key placeholder="Escribe una clave…" aria-label="Clave a insertar" maxlength="12" />
      <button type="button" class="btn btn-ghost btn-sm" data-add>Insertar</button>
      <button type="button" class="btn btn-ghost btn-sm" data-reset>Vaciar</button>
    </div>
    <p class="w-estado" aria-live="polite" data-estado></p>
    <div class="w-hash-buckets" data-viz></div>`;

  const input = el.querySelector<HTMLInputElement>('[data-key]')!;
  const estado = el.querySelector<HTMLElement>('[data-estado]')!;
  const viz = el.querySelector<HTMLElement>('[data-viz]')!;

  function pinta(activo = -1) {
    viz.replaceChildren(
      ...cubos.map((items, i) => {
        const b = document.createElement('div');
        b.className = 'w-bucket' + (i === activo ? ' is-activo' : '');
        const idx = document.createElement('span');
        idx.className = 'w-bucket-idx';
        idx.textContent = String(i);
        const cont = document.createElement('div');
        cont.className = 'w-bucket-items';
        for (const it of items) {
          const chip = document.createElement('span');
          chip.className = 'w-chip-item';
          chip.textContent = it;
          cont.append(chip);
        }
        b.append(idx, cont);
        return b;
      }),
    );
  }

  function insertar(clave: string) {
    const c = clave.trim().toLowerCase();
    if (!c) return;
    const i = hash(c, n);
    const colision = cubos[i].length > 0;
    cubos[i].push(c);
    total++;
    const carga = (total / n).toFixed(2);
    let nota = `hash("${c}") % ${n} = <b>${i}</b>.`;
    if (colision) nota += ` Colisión → se encadena en el cubo ${i}.`;
    nota += ` Factor de carga: ${carga}.`;
    if (total / n > 0.75) nota += ' Alto: una tabla real se redimensionaría (rehash O(n)).';
    estado.innerHTML = nota;
    pinta(i);
  }

  el.querySelector('[data-add]')!.addEventListener('click', () => {
    const val = input.value.trim() || EJEMPLOS[sugerencia++ % EJEMPLOS.length];
    insertar(val);
    input.value = '';
    input.focus();
  });
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      el.querySelector<HTMLButtonElement>('[data-add]')!.click();
    }
  });
  el.querySelector('[data-reset]')!.addEventListener('click', () => {
    cubos.forEach((b) => (b.length = 0));
    total = 0;
    estado.innerHTML = 'Tabla vacía.';
    pinta();
  });

  estado.innerHTML = `Inserta claves: cada una cae en <b>hash(clave) % ${n}</b>. Prueba a provocar una colisión.`;
  pinta();
}
