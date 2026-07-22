/**
 * Widget: búsqueda binaria paso a paso.
 * Uso:  <div data-widget="binary-search" data-array="1,3,4,7,9,11,15" data-target="11"></div>
 * El array se ordena por si acaso (la búsqueda binaria lo exige).
 */
interface Paso {
  lo: number;
  hi: number;
  mid: number;
  encontrado: boolean;
  nota: string;
}

export function mount(el: HTMLElement): void {
  const arr = (el.dataset.array ?? '')
    .split(',')
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => a - b);
  const objetivo = parseInt(el.dataset.target ?? '', 10);
  if (arr.length === 0 || Number.isNaN(objetivo)) return;

  // Precalcular los pasos
  const pasos: Paso[] = [];
  let lo = 0;
  let hi = arr.length - 1;
  let encontrado = false;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === objetivo) {
      pasos.push({ lo, hi, mid, encontrado: true, nota: `arr[${mid}] = ${arr[mid]} = objetivo. ¡Encontrado en el índice ${mid}!` });
      encontrado = true;
      break;
    } else if (arr[mid] < objetivo) {
      pasos.push({ lo, hi, mid, encontrado: false, nota: `arr[${mid}] = ${arr[mid]} &lt; ${objetivo}: descarto la mitad izquierda.` });
      lo = mid + 1;
    } else {
      pasos.push({ lo, hi, mid, encontrado: false, nota: `arr[${mid}] = ${arr[mid]} &gt; ${objetivo}: descarto la mitad derecha.` });
      hi = mid - 1;
    }
  }
  if (!encontrado) {
    pasos.push({ lo: 0, hi: -1, mid: -1, encontrado: false, nota: `${objetivo} no está en el array (búsqueda agotada).` });
  }

  el.classList.add('w-frame', 'w-binsearch');
  el.innerHTML = `
    <p class="w-binsearch-obj">Buscando <b>${objetivo}</b> en un array ordenado de ${arr.length} elementos.</p>
    <div class="w-cells" data-viz></div>
    <p class="w-estado" aria-live="polite" data-estado></p>
    <div class="w-controls">
      <button type="button" class="btn btn-ghost btn-sm" data-prev>Anterior</button>
      <button type="button" class="btn btn-ghost btn-sm" data-next>Siguiente paso</button>
      <button type="button" class="btn btn-ghost btn-sm" data-reset>Reiniciar</button>
    </div>`;

  const viz = el.querySelector<HTMLElement>('[data-viz]')!;
  const estado = el.querySelector<HTMLElement>('[data-estado]')!;
  const btnPrev = el.querySelector<HTMLButtonElement>('[data-prev]')!;
  const btnNext = el.querySelector<HTMLButtonElement>('[data-next]')!;

  const celdas = arr.map((v, idx) => {
    const c = document.createElement('div');
    c.className = 'w-cell';
    const val = document.createElement('span');
    val.textContent = String(v);
    const num = document.createElement('span');
    num.className = 'w-idx';
    num.textContent = String(idx);
    c.append(val, num);
    return c;
  });
  viz.replaceChildren(...celdas);

  let paso = 0;
  function pinta() {
    const p = pasos[paso];
    celdas.forEach((c, idx) => {
      c.className = 'w-cell';
      if (idx < p.lo || idx > p.hi) c.classList.add('is-out');
      if (p.mid >= 0 && idx === p.lo) c.classList.add('is-lo');
      if (p.mid >= 0 && idx === p.hi) c.classList.add('is-hi');
      if (idx === p.mid) c.classList.add(p.encontrado ? 'is-found' : 'is-mid');
    });
    estado.innerHTML = `Paso ${paso + 1}/${pasos.length}: ${p.nota}`;
    btnPrev.disabled = paso === 0;
    btnNext.disabled = paso === pasos.length - 1;
  }

  btnPrev.addEventListener('click', () => {
    if (paso > 0) {
      paso--;
      pinta();
    }
  });
  btnNext.addEventListener('click', () => {
    if (paso < pasos.length - 1) {
      paso++;
      pinta();
    }
  });
  el.querySelector('[data-reset]')!.addEventListener('click', () => {
    paso = 0;
    pinta();
  });

  pinta();
}
