---
title: FizzBuzz
description: El clásico de calentamiento — múltiplos de 3, de 5 y de ambos.
difficulty: facil
category: algoritmos
tags: [bucles, modulo]
hints:
  - El operador módulo (%) devuelve el resto de una división. `n % 3 === 0` significa "n es múltiplo de 3".
  - Comprueba primero el caso "múltiplo de 3 y de 5" — si lo dejas para el final, nunca se alcanzará.
updated: 2026-07-21
---

Escribe una función que reciba un número `n` y devuelva un array con los números del 1 al `n` como cadenas, con tres excepciones:

- Múltiplos de 3 → `"Fizz"`
- Múltiplos de 5 → `"Buzz"`
- Múltiplos de 3 **y** de 5 → `"FizzBuzz"`

## Ejemplos

```
fizzBuzz(5)  → ["1", "2", "Fizz", "4", "Buzz"]
fizzBuzz(15) → [..., "13", "14", "FizzBuzz"]
```

Parece trivial — y lo es — pero sigue filtrando candidaturas en entrevistas porque condensa tres fundamentos: bucles, condiciones y el orden en que se evalúan.

<details class="solucion">
<summary>Ver solución</summary>

La clave está en **el orden de las condiciones**: "múltiplo de ambos" debe comprobarse primero, porque un múltiplo de 15 también lo es de 3 y de 5.

```ts
function fizzBuzz(n: number): string[] {
  const resultado: string[] = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) resultado.push('FizzBuzz');
    else if (i % 3 === 0) resultado.push('Fizz');
    else if (i % 5 === 0) resultado.push('Buzz');
    else resultado.push(String(i));
  }
  return resultado;
}
```

Variante sin duplicar palabras (escala mejor si añaden "múltiplos de 7 → Bazz"):

```ts
function fizzBuzz(n: number): string[] {
  return Array.from({ length: n }, (_, k) => {
    const i = k + 1;
    const palabra = (i % 3 === 0 ? 'Fizz' : '') + (i % 5 === 0 ? 'Buzz' : '');
    return palabra || String(i);
  });
}
```

**Complejidad**: O(n) en tiempo, O(n) en espacio (el array de salida).

</details>
