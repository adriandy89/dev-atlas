---
title: Arrays y listas enlazadas
description: Las dos formas de guardar una secuencia — memoria contigua contra nodos enlazados — y por qué el array gana más veces de las que dice el Big-O.
category: estructuras-de-datos
level: fundamentos
tags: [arrays, listas-enlazadas, memoria]
updated: 2026-07-22
order: 1
---

Todas las estructuras que estudiarás después — [pilas, colas](/temas/estructuras-de-datos/pilas-y-colas/), [tablas hash](/temas/estructuras-de-datos/tablas-hash/), árboles — se construyen sobre dos formas primitivas de guardar una secuencia en memoria. Entender su diferencia física, no solo su API, es lo que te permitirá predecir el rendimiento de todo lo demás.

## Dos fotografías de la memoria

Un **array** guarda sus elementos en un bloque **contiguo**; una **lista enlazada** los reparte donde haya sitio y los cose con punteros:

<div class="w-diagram">
<svg viewBox="0 0 460 210" role="img" aria-label="Arriba, un array como celdas contiguas en memoria. Abajo, una lista enlazada como nodos dispersos unidos por flechas.">
<defs><marker id="ll-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<text class="w-node-sub" x="14" y="26">Array: bloque contiguo — el índice es aritmética</text>
<rect class="w-node-accent" x="14" y="38" width="56" height="40" rx="7"></rect><text class="w-node-label" x="42" y="63" text-anchor="middle">7</text>
<rect class="w-node-accent" x="70" y="38" width="56" height="40" rx="7"></rect><text class="w-node-label" x="98" y="63" text-anchor="middle">2</text>
<rect class="w-node-accent" x="126" y="38" width="56" height="40" rx="7"></rect><text class="w-node-label" x="154" y="63" text-anchor="middle">9</text>
<rect class="w-node-accent" x="182" y="38" width="56" height="40" rx="7"></rect><text class="w-node-label" x="210" y="63" text-anchor="middle">4</text>
<text class="w-node-sub" x="42" y="94" text-anchor="middle">[0]</text>
<text class="w-node-sub" x="98" y="94" text-anchor="middle">[1]</text>
<text class="w-node-sub" x="154" y="94" text-anchor="middle">[2]</text>
<text class="w-node-sub" x="210" y="94" text-anchor="middle">[3]</text>
<text class="w-node-sub" x="14" y="128">Lista enlazada: nodos dispersos — cada uno apunta al siguiente</text>
<rect class="w-node" x="14" y="142" width="74" height="40" rx="7"></rect><text class="w-node-label" x="44" y="167" text-anchor="middle">7 •</text>
<rect class="w-node" x="150" y="142" width="74" height="40" rx="7"></rect><text class="w-node-label" x="180" y="167" text-anchor="middle">2 •</text>
<rect class="w-node" x="286" y="142" width="74" height="40" rx="7"></rect><text class="w-node-label" x="316" y="167" text-anchor="middle">9 •</text>
<rect class="w-node" x="386" y="142" width="60" height="40" rx="7"></rect><text class="w-node-label" x="416" y="167" text-anchor="middle">4 ∅</text>
<line class="w-edge" x1="88" y1="162" x2="146" y2="162" marker-end="url(#ll-arw)"></line>
<line class="w-edge" x1="224" y1="162" x2="282" y2="162" marker-end="url(#ll-arw)"></line>
<line class="w-edge" x1="360" y1="162" x2="382" y2="162" marker-end="url(#ll-arw)"></line>
</svg>
<p class="w-diagram-cap">La contigüidad del array es la que regala el acceso O(1): la dirección del elemento i es base + i × tamaño. La lista no puede hacer esa cuenta — tiene que caminar.</p>
</div>

Esa diferencia física genera **todos** los costes:

| Operación | Array | Lista enlazada |
| --- | --- | --- |
| Acceso por índice | **O(1)** — aritmética | O(n) — caminar desde la cabeza |
| Buscar un valor | O(n) | O(n) |
| Insertar/borrar al principio | O(n) — desplazar todo | **O(1)** — recolocar un puntero |
| Insertar/borrar al final | O(1) amortizado | O(1) con puntero a cola |
| Insertar/borrar en medio | O(n) — desplazar | **O(1)** *si ya tienes el nodo* |
| Memoria extra | Ninguna | Un puntero (o dos) por elemento |

La letra pequeña de la lista — "*si ya tienes el nodo*" — es crucial: llegar hasta el nodo ya cuesta O(n). La lista brilla cuando **otra estructura te guarda la referencia al nodo**, como verás en la caché LRU.

## El array dinámico: por qué `push` es O(1) "amortizado"

Los arrays de los lenguajes modernos (el `Array` de JavaScript, el `list` de Python, el `Vec` de Rust) son **dinámicos**: cuando el bloque se llena, reservan otro mayor (típicamente el doble) y copian todo. Esa copia es O(n)… pero ocurre tan pocas veces que, repartida entre todos los `push`, cada uno sale a **O(1) amortizado**. Es el mismo truco de "pagar caro rara vez" que ya viste en el [redimensionado de las tablas hash](/temas/estructuras-de-datos/tablas-hash/).

En cambio, `unshift` (insertar al principio) desplaza todos los elementos **cada vez**: O(n) siempre. Un bucle de `unshift` es O(n²) disfrazado — el clásico bug de rendimiento silencioso.

## La ventaja invisible del array: la caché de la CPU

El Big-O de la tabla sugiere un empate técnico. La realidad de la máquina, no:

<aside class="callout callout-idea">
<p class="callout-titulo">Idea</p>

La CPU no lee la memoria byte a byte: la lee por **líneas de caché** (~64 bytes). Al tocar `arr[0]`, los siguientes elementos ya están en caché — recorrer un array es surfear memoria precargada. Los nodos de una lista viven dispersos: cada salto de puntero es un posible **fallo de caché**, decenas de veces más lento. Por eso, en benchmarks reales, el array gana incluso en operaciones donde la lista tiene mejor Big-O.
</aside>

La consecuencia práctica: **el array es la respuesta por defecto**. La lista enlazada se gana su sitio en casos concretos, no como opción general.

## Cuándo la lista enlazada es la elección correcta

- **Caché LRU**: una tabla hash guarda referencias directas a los nodos de una lista doblemente enlazada — mover un elemento al frente es O(1) real. Es exactamente el [problema de la caché LRU](/problemas/cache-lru/).
- **Colas y deques**: insertar y extraer por ambos extremos en O(1) sin desplazar nada.
- **Insertar mientras iteras**: puedes empalmar nodos sin invalidar el recorrido ni mover el resto.

Y una advertencia honesta: en JavaScript rara vez escribirás una lista enlazada fuera de estos patrones — pero **reconocerla dentro** de las estructuras que usas (y en las entrevistas) es no negociable.

## El detalle JavaScript

El `Array` de JavaScript es un array dinámico de verdad *mientras lo trates como tal*: índices densos desde 0. Si lo llenas con huecos (`arr[5000] = x` sobre un array vacío) el motor lo degrada internamente a un diccionario, y adiós contigüidad. Densidad = velocidad.

<div data-widget="mini-quiz" data-count="3"></div>
