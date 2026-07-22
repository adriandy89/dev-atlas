---
title: Búsqueda en array rotado
description: Encuentra un valor en O(log n) dentro de un array ordenado que fue rotado en un punto desconocido.
difficulty: dificil
category: algoritmos
tags: [busqueda-binaria, arrays]
hints:
  - 'Aunque el array esté rotado, al partirlo por la mitad una de las dos mitades SIEMPRE está ordenada. ¿Cómo sabes cuál?'
  - 'Compara arr[izq] con arr[medio]: si arr[izq] <= arr[medio], la mitad izquierda está ordenada.'
  - 'Con la mitad ordenada identificada, comprueba si el objetivo cae dentro de su rango; si sí, busca ahí, y si no, en la otra mitad.'
updated: 2026-07-22
---

Un array **ordenado y sin duplicados** fue rotado en un punto desconocido: `[0, 2, 5, 7, 9, 12]` rotado en el índice 3 se convierte en `[7, 9, 12, 0, 2, 5]`. Encuentra el índice de un valor objetivo — o `-1` si no está — en **O(log n)**.

## Ejemplos

```
buscar([7, 9, 12, 0, 2, 5], 2)  → 4
buscar([7, 9, 12, 0, 2, 5], 7)  → 0
buscar([7, 9, 12, 0, 2, 5], 3)  → -1
buscar([5, 1, 3], 1)            → 1
```

La restricción de O(log n) descarta el recorrido lineal: esto pide [búsqueda binaria](/temas/algoritmos/busqueda-binaria/)… sobre un array que ya no está del todo ordenado. Es la variante favorita de las entrevistas porque obliga a entender *por qué* funciona la búsqueda binaria, no solo a recitarla.

<details class="solucion">
<summary>Ver solución</summary>

La observación que desbloquea el problema: al partir un array rotado por la mitad, **al menos una de las dos mitades está ordenada**. La rotación solo introduce una "costura", y la costura solo puede caer en una mitad a la vez.

El algoritmo en cada paso:

1. Identifica qué mitad está ordenada (comparando los extremos con el medio).
2. Pregunta si el objetivo **cae en el rango de la mitad ordenada** — esa pregunta sí puede responderse con certeza, porque el rango es continuo.
3. Quédate con la mitad correspondiente y repite.

```ts
function buscar(arr: number[], objetivo: number): number {
  let izq = 0;
  let der = arr.length - 1;

  while (izq <= der) {
    const medio = izq + Math.floor((der - izq) / 2);
    if (arr[medio] === objetivo) return medio;

    if (arr[izq] <= arr[medio]) {
      // La mitad izquierda está ordenada
      if (arr[izq] <= objetivo && objetivo < arr[medio]) {
        der = medio - 1; // el objetivo cae en su rango → busca ahí
      } else {
        izq = medio + 1; // si no, está en la otra mitad (con la costura)
      }
    } else {
      // La mitad derecha está ordenada
      if (arr[medio] < objetivo && objetivo <= arr[der]) {
        izq = medio + 1;
      } else {
        der = medio - 1;
      }
    }
  }

  return -1;
}
```

Los detalles que separan la solución correcta de la que falla en el juez:

- **`arr[izq] <= arr[medio]`** con `<=`, no `<`: con dos elementos (`izq === medio`), la "mitad izquierda" de un solo elemento está trivialmente ordenada y hay que tratarla como tal.
- Los rangos usan `<=` en los extremos y `<` contra `arr[medio]`, porque el medio ya se comprobó.
- Con **duplicados** (`[3, 1, 3, 3, 3]`) la comparación `arr[izq] <= arr[medio]` deja de identificar la mitad ordenada con certeza y el peor caso degrada a O(n) — por eso el enunciado los excluye.

**Complejidad**: O(log n) en tiempo — cada paso descarta la mitad del espacio, igual que la búsqueda binaria clásica — y O(1) en espacio.

</details>
