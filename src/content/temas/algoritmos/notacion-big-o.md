---
title: Notación Big-O
description: Qué mide la notación Big-O, cómo leerla y las clases de complejidad que aparecen una y otra vez.
category: algoritmos
level: fundamentos
tags: [complejidad, rendimiento, fundamentos]
updated: 2026-07-21
order: 1
---

La notación Big-O describe **cómo crece el coste de un algoritmo cuando crece la entrada**. No mide segundos: mide la *forma* del crecimiento. Un algoritmo O(n) sobre un array de un millón de elementos hace del orden de un millón de operaciones; uno O(log n), unas veinte.

## Qué mide exactamente

Big-O expresa una cota superior del crecimiento en el **peor caso**, ignorando constantes y términos menores:

- `3n² + 5n + 20` → **O(n²)**: para n grande, el término cuadrático domina.
- Recorrer un array dos veces seguidas es `2n` → **O(n)**: las constantes no cambian la forma.

Por eso dos algoritmos O(n) pueden tener rendimientos reales muy distintos. Big-O sirve para comparar *estrategias*, no implementaciones concretas.

## Las clases que debes reconocer

| Clase | Nombre | Ejemplo típico |
| --- | --- | --- |
| O(1) | Constante | Acceso a un índice de un array |
| O(log n) | Logarítmica | Búsqueda binaria |
| O(n) | Lineal | Recorrer una lista |
| O(n log n) | Casi lineal | Mergesort, quicksort medio |
| O(n²) | Cuadrática | Doble bucle anidado |
| O(2ⁿ) | Exponencial | Subconjuntos por fuerza bruta |

Activa y desactiva curvas para comparar cómo escala cada clase al crecer la entrada:

<figure class="w-bigo">
<div class="w-bigo-legend">
<label class="w-bigo-leg" style="--leg: var(--c-1)"><input type="checkbox" id="bigo-1" checked><span><i class="w-bigo-dot"></i>O(1)</span></label>
<label class="w-bigo-leg" style="--leg: var(--c-logn)"><input type="checkbox" id="bigo-logn" checked><span><i class="w-bigo-dot"></i>O(log n)</span></label>
<label class="w-bigo-leg" style="--leg: var(--c-n)"><input type="checkbox" id="bigo-n" checked><span><i class="w-bigo-dot"></i>O(n)</span></label>
<label class="w-bigo-leg" style="--leg: var(--c-nlogn)"><input type="checkbox" id="bigo-nlogn" checked><span><i class="w-bigo-dot"></i>O(n log n)</span></label>
<label class="w-bigo-leg" style="--leg: var(--c-n2)"><input type="checkbox" id="bigo-n2" checked><span><i class="w-bigo-dot"></i>O(n²)</span></label>
<label class="w-bigo-leg" style="--leg: var(--c-2n)"><input type="checkbox" id="bigo-2n" checked><span><i class="w-bigo-dot"></i>O(2ⁿ)</span></label>
</div>
<svg viewBox="0 0 340 210" role="img" aria-label="Gráfica del crecimiento de las clases de complejidad: O(1) plana, O(log n) casi plana, O(n) lineal, O(n log n) algo superior, O(n²) cuadrática y O(2ⁿ) exponencial que se dispara.">
<line class="w-bigo-axis" x1="40" y1="20" x2="40" y2="188"></line>
<line class="w-bigo-axis" x1="40" y1="188" x2="326" y2="188"></line>
<text class="w-bigo-axis-label" x="330" y="185" text-anchor="end">n →</text>
<text class="w-bigo-axis-label" x="36" y="16" text-anchor="end">ops</text>
<polyline data-curve="1" points="44,180 322,180"></polyline>
<polyline data-curve="logn" points="44,182 90,158 136,146 182,138 228,132 274,127 322,123"></polyline>
<polyline data-curve="n" points="44,185 182,128 322,72"></polyline>
<polyline data-curve="nlogn" points="44,186 90,168 136,146 182,120 228,92 274,64 322,38"></polyline>
<polyline data-curve="n2" points="44,187 90,183 136,171 182,150 228,118 274,74 316,26"></polyline>
<polyline data-curve="2n" points="44,188 122,186 176,178 206,162 226,132 242,86 252,26"></polyline>
</svg>
<figcaption class="w-diagram-cap">Misma entrada, coste muy distinto: para n grande, O(2ⁿ) y O(n²) se disparan mientras O(log n) apenas se mueve.</figcaption>
</figure>

## Cómo estimarla leyendo código

Reglas rápidas que resuelven la mayoría de los casos:

```ts
// O(n): un bucle proporcional a la entrada
for (const x of items) hacerAlgo(x);

// O(n²): bucle dentro de bucle sobre la misma entrada
for (const a of items) for (const b of items) comparar(a, b);

// O(n + m): bucles consecutivos sobre entradas distintas — se suman
for (const a of listaA) procesar(a);
for (const b of listaB) procesar(b);

// O(log n): el problema se parte a la mitad en cada paso
while (n > 1) n = Math.floor(n / 2);
```

### No solo tiempo: también memoria

La **complejidad espacial** usa la misma notación para la memoria extra. Invertir un array in situ es O(1) en espacio; construir uno nuevo es O(n). En sistemas con memoria limitada, esta dimensión importa tanto como la temporal.

## Errores comunes

- **Optimizar sin medir.** Big-O orienta el diseño, pero el cuello de botella real se encuentra con un profiler.
- **Ignorar el tamaño real de n.** Para n = 20, un O(n²) simple puede ganar a un O(n log n) con constantes grandes.
- **Confundir peor caso con caso medio.** Quicksort es O(n²) en el peor caso pero O(n log n) de media, y en la práctica es excelente.

<div data-widget="mini-quiz" data-count="3"></div>

Dominar Big-O es el requisito para todo lo demás en esta categoría: cuando compares [búsqueda binaria](/temas/algoritmos/busqueda-binaria/) con una búsqueda lineal, la notación te dirá exactamente qué estás ganando.
