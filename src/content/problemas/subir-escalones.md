---
title: Subir escalones
description: Cuenta de cuántas formas puedes subir n escalones dando pasos de 1 o 2 — y descubre por qué la recursión ingenua explota.
difficulty: medio
category: algoritmos
tags: [recursion, programacion-dinamica, memoizacion]
hints:
  - 'Para llegar al escalón n, tu último paso vino del n−1 (paso de 1) o del n−2 (paso de 2). ¿Qué relación te da eso?'
  - 'formas(n) = formas(n−1) + formas(n−2). ¿Te suena esa recurrencia de algo?'
  - 'La recursión directa recalcula los mismos subproblemas una y otra vez: dibuja el árbol de llamadas de formas(5) y cuenta cuántas veces aparece formas(2).'
updated: 2026-07-22
---

Estás al pie de una escalera de `n` escalones. En cada paso puedes subir **1 o 2 escalones**. ¿De cuántas formas distintas puedes llegar arriba?

## Ejemplos

```
formas(1) → 1    // [1]
formas(2) → 2    // [1+1], [2]
formas(3) → 3    // [1+1+1], [1+2], [2+1]
formas(4) → 5    // [1+1+1+1], [1+1+2], [1+2+1], [2+1+1], [2+2]
formas(10) → 89
```

Este es el problema-puerta de la **programación dinámica**: la solución correcta está a un paso de la [recursión](/temas/algoritmos/recursion/) que ya conoces, y el salto entre ambas es la diferencia entre un programa que termina en microsegundos y uno que no termina.

<details class="solucion">
<summary>Ver solución</summary>

**La recurrencia.** Para pisar el escalón `n`, tu último paso salió del `n−1` o del `n−2`. Esas dos opciones no se solapan y cubren todos los casos, así que:

```
formas(n) = formas(n−1) + formas(n−2)
```

— la recurrencia de Fibonacci, disfrazada de escalera.

**Por qué la recursión directa explota.** `formas(50)` con la recursión ingenua hace ~2⁵⁰ llamadas, porque recalcula los mismos subproblemas una y otra vez (`formas(2)` aparece cientos de miles de veces en el árbol). Complejidad O(2ⁿ): inviable.

**Arreglo 1 — memoización** (la recursión, más una caché):

```ts
function formas(n: number, memo = new Map<number, number>()): number {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n)!;
  const r = formas(n - 1, memo) + formas(n - 2, memo);
  memo.set(n, r);
  return r;
}
```

Cada subproblema se calcula **una vez**: O(n) en tiempo, O(n) en espacio. La estructura recursiva del razonamiento se conserva intacta.

**Arreglo 2 — iterativo con dos variables** (la versión pulida):

```ts
function formas(n: number): number {
  if (n <= 2) return n;
  let dosAtras = 1; // formas(1)
  let unaAtras = 2; // formas(2)
  for (let i = 3; i <= n; i++) {
    [dosAtras, unaAtras] = [unaAtras, dosAtras + unaAtras];
  }
  return unaAtras;
}
```

Para calcular `formas(i)` solo hacen falta los dos valores anteriores — no toda la tabla: O(n) en tiempo, **O(1) en espacio**.

**La lección transferible**: cuando una recursión es correcta pero lenta, pregúntate si repite subproblemas. Si sí — memoización primero (mecánica, sin re-pensar nada), versión iterativa después si necesitas exprimir memoria. Ese par de movimientos *es* la programación dinámica.

</details>
