---
title: Algoritmos de ordenación
description: De la burbuja a Timsort — cómo ordenan los algoritmos clásicos, qué es la estabilidad y por qué tu lenguaje ya eligió por ti.
category: algoritmos
level: fundamentos
tags: [ordenacion, complejidad, estabilidad]
updated: 2026-07-22
order: 4
---

Ordenar es el problema más estudiado de la informática — no porque ordenar sea fascinante, sino porque **los datos ordenados habilitan todo lo demás**: la [búsqueda binaria](/temas/algoritmos/busqueda-binaria/), los rangos, los índices, la deduplicación. Y los algoritmos clásicos de ordenación son el mejor gimnasio que existe para razonar sobre [complejidad](/temas/algoritmos/notacion-big-o/).

## Burbuja: el algoritmo-maestro (para aprender)

La ordenación por burbuja recorre el array comparando **pares adyacentes** e intercambiándolos si están en desorden. Tras cada pasada, el mayor pendiente "burbujea" hasta su posición final. Míralo trabajar:

<div data-widget="sorting" data-array="5,2,8,1,9,4,7,3"></div>

```ts
function burbuja(arr: number[]): number[] {
  for (let i = 0; i < arr.length - 1; i++) {
    let huboCambios = false;
    // El final ya está ordenado: cada pasada colocó un máximo
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        huboCambios = true;
      }
    }
    if (!huboCambios) break; // pasada limpia = ya está ordenado
  }
  return arr;
}
```

Nadie usa burbuja en producción — es O(n²) — pero enseña tres ideas que reaparecen en todos los demás: la **invariante** (el tramo final siempre está ordenado), la **detección de trabajo terminado** (pasada sin cambios → fin), y el análisis del peor caso frente al mejor (array ya ordenado: una sola pasada, O(n)).

## La familia O(n²): cuándo cada una

- **Inserción**: como ordenar cartas en la mano — toma el siguiente elemento y deslízalo hasta su sitio entre los ya ordenados. Es **el mejor de los cuadráticos en la práctica**: casi O(n) con datos casi ordenados, y imbatible en arrays pequeños (&lt;20 elementos).
- **Selección**: busca el mínimo del resto y colócalo. Siempre O(n²) — hasta con el array ya ordenado — pero hace el **mínimo número de intercambios** (n−1), útil si escribir es carísimo.
- **Burbuja**: la que acabas de ver. Su único mérito práctico es pedagógico.

## El salto a O(n log n)

La barrera teórica de la ordenación por comparación es **O(n log n)** — no existe algoritmo por comparaciones que la baje. Los dos clásicos que la alcanzan usan la misma arma: **divide y vencerás**.

- **Merge sort**: divide el array en dos mitades, ordena cada una recursivamente y **mezcla** las dos mitades ordenadas (la mezcla es O(n)). Garantiza O(n log n) *siempre*, es estable, y a cambio usa O(n) de memoria extra.
- **Quicksort**: elige un **pivote**, separa menores a un lado y mayores al otro, y repite en cada lado. Ordena in situ y en la práctica es rapidísimo — pero con mala elección de pivote (por ejemplo, siempre el primero sobre un array ya ordenado) degenera a **O(n²)**. Por eso las implementaciones reales aleatorizan el pivote o usan la mediana de tres.

| Algoritmo | Peor caso | Caso medio | Memoria extra | ¿Estable? |
| --- | --- | --- | --- | --- |
| Burbuja | O(n²) | O(n²) | O(1) | Sí |
| Inserción | O(n²) | O(n²) | O(1) | Sí |
| Selección | O(n²) | O(n²) | O(1) | No |
| Merge sort | O(n log n) | O(n log n) | O(n) | Sí |
| Quicksort | O(n²) | O(n log n) | O(log n) | No |

## Estabilidad: el detalle que sí importa

Un algoritmo es **estable** si los elementos con la misma clave conservan su orden relativo. Parece un tecnicismo hasta que ordenas dos veces:

```ts
// Facturas ya ordenadas por fecha; ahora, por cliente:
facturas.sort((a, b) => a.cliente.localeCompare(b.cliente));
// Estable   → dentro de cada cliente SIGUEN por fecha ✅
// Inestable → el orden por fecha se pierde ❌
```

Con un algoritmo estable, ordenaciones sucesivas **componen**: por fecha y luego por cliente = agrupado por cliente y cronológico dentro. Es la forma idiomática de ordenar por múltiples criterios.

<aside class="callout callout-idea">
<p class="callout-titulo">Idea</p>

Desde ES2019, `Array.prototype.sort` es **estable por especificación** en JavaScript. Pero recuerda su otra trampa: sin comparador ordena como *strings* — `[10, 2, 1].sort()` devuelve `[1, 10, 2]`. Pasa siempre `(a, b) => a - b` para números.
</aside>

## Lo que tu lenguaje usa de verdad

Los runtimes no eligen *un* algoritmo — los **combinan**:

- **Timsort** (Python, Java, V8 para JavaScript): merge sort que detecta tramos ya ordenados (*runs*) y usa inserción en los pequeños. Con datos del mundo real — que casi nunca vienen en orden aleatorio — vuela.
- **pdqsort / introsort** (C++, Rust, Go): quicksort que se autovigila y salta a heapsort si detecta que degenera, e inserción en los tramos cortos.

La lección de diseño es finísima: los algoritmos "de juguete" que acabas de aprender **son los ingredientes** de los industriales. Inserción vive dentro de Timsort; la idea de mezcla de merge sort, también. Entenderlos no era ejercicio académico — era leer las piezas del motor real.

<div data-widget="mini-quiz" data-count="3"></div>
