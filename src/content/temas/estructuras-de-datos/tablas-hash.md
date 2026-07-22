---
title: Tablas hash
description: Cómo consiguen acceso O(1) medio, qué son las colisiones y por qué importa el factor de carga.
category: estructuras-de-datos
level: fundamentos
tags: [hash, diccionarios, maps]
updated: 2026-07-21
order: 3
---

Una tabla hash asocia claves con valores y ofrece inserción, búsqueda y borrado en **O(1) de media**. Es la estructura detrás de `Map` y los objetos de JavaScript, `dict` de Python o `HashMap` de Java — probablemente la estructura de datos más usada del mundo.

## Cómo funciona

1. Una **función hash** convierte la clave en un número.
2. Ese número, módulo el tamaño interno, decide el **índice del bucket** donde guardar el valor.
3. Para buscar, se repite el cálculo y se va directo al bucket: sin recorrer nada.

```ts
const indice = hash(clave) % numBuckets;
```

La magia depende de que la función hash reparta las claves **uniformemente**. Una función pobre concentra todo en pocos buckets y degrada la tabla a una lista.

## Colisiones: inevitables por definición

Hay infinitas claves posibles y buckets finitos, así que dos claves distintas acabarán en el mismo índice. Las dos estrategias clásicas:

### Encadenamiento (chaining)

Cada bucket guarda una pequeña lista de entradas. Al buscar, se recorre esa lista comparando claves. Java añade un refinamiento: si una lista crece demasiado, la convierte en árbol para garantizar O(log n) en el peor caso.

Inserta claves y observa en qué bucket caen; con pocas casillas provocarás colisiones que se encadenan:

<div data-widget="hash-table" data-buckets="8"></div>

### Direccionamiento abierto (open addressing)

Si el bucket está ocupado, se prueba el siguiente según una secuencia (lineal, cuadrática…). Aprovecha mejor la caché de la CPU, pero borrar elementos se complica (hacen falta marcas de "borrado").

## El factor de carga

El **factor de carga** es `elementos / buckets`. Cuando supera un umbral (típicamente 0,75), la tabla se **redimensiona**: reserva más buckets y re-inserta todo. Esa operación puntual es O(n), pero amortizada entre todas las inserciones el coste sigue siendo O(1).

Dos consecuencias prácticas:

- Si conoces el tamaño final, **pre-dimensiona** la tabla y evita redimensionados.
- El peor caso teórico es O(n); por eso decimos O(1) *medio*, no garantizado.

## Cuándo NO usar una tabla hash

- Necesitas **orden** (rangos, "el siguiente mayor que…"): usa un árbol balanceado o una lista ordenada con búsqueda binaria.
- Necesitas el **mínimo/máximo** constantemente: usa un heap.
- Las claves son enteros pequeños y densos: un array simple es más rápido y compacto.

Compara con [pilas y colas](/temas/estructuras-de-datos/pilas-y-colas/) para ver cómo cada estructura optimiza un patrón de acceso distinto.
