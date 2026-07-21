---
title: Dos números que suman un objetivo
description: Encuentra los índices de los dos números que suman el objetivo — de O(n²) a O(n) con una tabla hash.
difficulty: medio
category: estructuras-de-datos
tags: [hash, arrays]
hints:
  - La fuerza bruta con doble bucle funciona, pero es O(n²). ¿Qué información podrías recordar mientras recorres?
  - Para cada número x, la pregunta real es "¿he visto ya objetivo − x?". ¿Qué estructura responde eso en O(1)?
updated: 2026-07-21
---

Dado un array de enteros `nums` y un entero `objetivo`, devuelve **los índices** de los dos números que suman `objetivo`. Puedes asumir que existe exactamente una solución y que no puedes usar el mismo elemento dos veces.

## Ejemplos

```
dosSuman([2, 7, 11, 15], 9) → [0, 1]   (2 + 7 = 9)
dosSuman([3, 2, 4], 6)      → [1, 2]   (2 + 4 = 6)
dosSuman([3, 3], 6)         → [0, 1]
```

Es el problema nº 1 de LeetCode por una razón: la mejora de O(n²) a O(n) ilustra el uso más rentable de una tabla hash.

<details class="solucion">
<summary>Ver solución</summary>

**Fuerza bruta** — probar todas las parejas, O(n²):

```ts
function dosSuman(nums: number[], objetivo: number): [number, number] | null {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === objetivo) return [i, j];
    }
  }
  return null;
}
```

**Con tabla hash** — una sola pasada, O(n). Reformula la pregunta: para cada `x`, ¿ya vi su *complemento* `objetivo − x`?

```ts
function dosSuman(nums: number[], objetivo: number): [number, number] | null {
  const vistos = new Map<number, number>(); // valor → índice

  for (let i = 0; i < nums.length; i++) {
    const complemento = objetivo - nums[i];
    const j = vistos.get(complemento);
    if (j !== undefined) return [j, i];
    vistos.set(nums[i], i);
  }
  return null;
}
```

Registrar cada número **después** de comprobar su complemento evita usar el mismo elemento dos veces, y con duplicados (`[3, 3]`) el primer 3 ya está en el mapa cuando llega el segundo.

**Complejidad**: O(n) en tiempo, O(n) en espacio. El patrón "cambiar una búsqueda repetida por una consulta a un mapa" reaparece en decenas de problemas — interiorízalo.

</details>
