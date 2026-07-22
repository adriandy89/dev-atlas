---
title: Árboles binarios de búsqueda
description: La estructura que mantiene los datos ordenados mientras crece — búsqueda, inserción y recorridos, y el peligro del árbol degenerado.
category: estructuras-de-datos
level: fundamentos
tags: [arboles, bst, recursion, recorridos]
updated: 2026-07-22
order: 4
---

Un array ordenado busca en O(log n) con [búsqueda binaria](/temas/algoritmos/busqueda-binaria/)… pero insertar en él es O(n) — hay que desplazar. Una [tabla hash](/temas/estructuras-de-datos/tablas-hash/) inserta en O(1)… pero pierde el orden. El **árbol binario de búsqueda (BST)** es la estructura que se niega a elegir: mantiene los datos ordenados **y** admite buscar, insertar y borrar en O(log n).

## La invariante que lo es todo

Un árbol binario es una jerarquía donde cada **nodo** tiene como mucho dos hijos. Lo que lo convierte en árbol *de búsqueda* es una regla global:

> Todo lo que cuelga a la **izquierda** de un nodo es **menor**; todo lo que cuelga a la **derecha**, **mayor**.

<div class="w-diagram">
<svg viewBox="0 0 460 230" role="img" aria-label="Árbol binario de búsqueda con raíz 8: a su izquierda 3 con hijos 1 y 6; a su derecha 12 con hijos 10 y 14.">
<defs><marker id="ab-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<circle class="w-node-accent" cx="230" cy="36" r="24"></circle><text class="w-node-label" x="230" y="42" text-anchor="middle">8</text>
<circle class="w-node" cx="130" cy="112" r="24"></circle><text class="w-node-label" x="130" y="118" text-anchor="middle">3</text>
<circle class="w-node" cx="330" cy="112" r="24"></circle><text class="w-node-label" x="330" y="118" text-anchor="middle">12</text>
<circle class="w-node" cx="70" cy="192" r="24"></circle><text class="w-node-label" x="70" y="198" text-anchor="middle">1</text>
<circle class="w-node" cx="180" cy="192" r="24"></circle><text class="w-node-label" x="180" y="198" text-anchor="middle">6</text>
<circle class="w-node" cx="280" cy="192" r="24"></circle><text class="w-node-label" x="280" y="198" text-anchor="middle">10</text>
<circle class="w-node" cx="390" cy="192" r="24"></circle><text class="w-node-label" x="390" y="198" text-anchor="middle">14</text>
<line class="w-edge" x1="212" y1="52" x2="146" y2="94" marker-end="url(#ab-arw)"></line>
<line class="w-edge" x1="248" y1="52" x2="314" y2="94" marker-end="url(#ab-arw)"></line>
<line class="w-edge" x1="115" y1="131" x2="82" y2="170" marker-end="url(#ab-arw)"></line>
<line class="w-edge" x1="143" y1="132" x2="169" y2="171" marker-end="url(#ab-arw)"></line>
<line class="w-edge" x1="317" y1="132" x2="291" y2="171" marker-end="url(#ab-arw)"></line>
<line class="w-edge" x1="345" y1="131" x2="378" y2="170" marker-end="url(#ab-arw)"></line>
<text class="w-node-sub" x="130" y="66" text-anchor="middle">&lt; 8</text>
<text class="w-node-sub" x="330" y="66" text-anchor="middle">&gt; 8</text>
</svg>
<p class="w-diagram-cap">Buscar 10: ¿10 &gt; 8? derecha. ¿10 &lt; 12? izquierda. Encontrado — tres comparaciones. Cada paso descarta un subárbol entero.</p>
</div>

¿Te suena la mecánica? **Un BST es la búsqueda binaria convertida en estructura**: en lugar de calcular el medio de un array, el "medio" ya está materializado como raíz de cada subárbol.

## Buscar e insertar

La invariante hace que ambas operaciones sean una caminata guiada — y la definición recursiva del árbol (cada hijo es raíz de su propio subárbol) hace natural escribirlas con [recursión](/temas/algoritmos/recursion/):

```ts
interface Nodo {
  valor: number;
  izq: Nodo | null;
  der: Nodo | null;
}

function buscar(nodo: Nodo | null, x: number): boolean {
  if (nodo === null) return false; // caso base: rama agotada
  if (x === nodo.valor) return true;
  return x < nodo.valor ? buscar(nodo.izq, x) : buscar(nodo.der, x);
}

function insertar(nodo: Nodo | null, x: number): Nodo {
  if (nodo === null) return { valor: x, izq: null, der: null };
  if (x < nodo.valor) nodo.izq = insertar(nodo.izq, x);
  else if (x > nodo.valor) nodo.der = insertar(nodo.der, x);
  return nodo; // duplicados: ignorados en esta versión
}
```

El coste de ambas es **O(altura)** — y ahí está la letra pequeña del BST.

## El árbol degenerado: la trampa del O(log n)

O(altura) solo es O(log n) si el árbol está **equilibrado**. Inserta `1, 2, 3, 4, 5` en orden y mira lo que construyes: cada valor va a la derecha del anterior. El "árbol" es una lista enlazada inclinada, altura n, y toda operación cae a **O(n)**.

<aside class="callout callout-aviso">
<p class="callout-titulo">Aviso</p>

El peor caso del BST ingenuo no es exótico: **insertar datos ya ordenados** — lo más normal del mundo — lo produce. Por eso las implementaciones serias usan árboles **autoequilibrados** (AVL, rojo-negro) que se reestructuran al insertar y garantizan O(log n) siempre. Son los que viven dentro de `std::map` de C++, `TreeMap` de Java — y, generalizados a disco, de los [índices B-tree](/temas/bases-de-datos/indices-de-base-de-datos/) de tu base de datos.
</aside>

## Recorridos: cuatro maneras de visitar todo

- **Inorden** (izquierda → nodo → derecha): visita los valores **en orden ascendente**. Es el superpoder del BST — "dame todo ordenado" sale gratis.
- **Preorden** (nodo → hijos): útil para copiar o serializar el árbol.
- **Postorden** (hijos → nodo): útil para liberar/borrar (los hijos antes que el padre).
- **Por niveles (BFS)**: con una [cola](/temas/estructuras-de-datos/pilas-y-colas/), visita nivel a nivel — la base de "imprimir el árbol por plantas".

```ts
function inorden(nodo: Nodo | null, visita: (v: number) => void): void {
  if (nodo === null) return;
  inorden(nodo.izq, visita);
  visita(nodo.valor);
  inorden(nodo.der, visita);
}
// Sobre el árbol del diagrama: 1, 3, 6, 8, 10, 12, 14 — ordenado ✓
```

Un truco de entrevista que sale de aquí: **verificar si un árbol es un BST válido** = comprobar que su recorrido inorden sale ordenado.

## Árboles más allá del BST

La forma jerárquica aparece en cuanto miras alrededor: el DOM de esta página, el sistema de ficheros, el JSON que parsea tu API, el árbol de sintaxis que tu compilador construye con cada build. No todos son de búsqueda — pero todos se recorren con las mismas cuatro estrategias que acabas de aprender, y esa es la habilidad transferible.

<div data-widget="mini-quiz" data-count="3"></div>
