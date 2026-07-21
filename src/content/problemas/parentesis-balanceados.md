---
title: Paréntesis balanceados
description: Valida si una cadena de paréntesis, corchetes y llaves está correctamente balanceada.
difficulty: medio
category: estructuras-de-datos
tags: [pilas, cadenas]
hints:
  - "\"Lo último que se abre es lo primero que debe cerrarse\" — ¿qué estructura de datos encaja con esa frase?"
  - Al encontrar un cierre, compáralo con lo que haya en la cima de la pila.
  - 'Cuidado con los dos extremos: un cierre con la pila vacía, y una pila no vacía al terminar.'
updated: 2026-07-21
---

Dada una cadena que solo contiene `()[]{}`, determina si está **balanceada**: cada apertura se cierra con el mismo tipo y en el orden correcto.

## Ejemplos

```
balanceada("()")     → true
balanceada("()[]{}") → true
balanceada("(]")     → false
balanceada("([)]")   → false
balanceada("{[]}")   → true
balanceada("(")      → false
balanceada(")")      → false
```

Es el mismo problema que resuelve tu editor al marcar un paréntesis sin pareja, o un parser al validar bloques anidados.

<details class="solucion">
<summary>Ver solución</summary>

El anidamiento es LIFO por naturaleza: **una pila** es la respuesta.

```ts
function balanceada(s: string): boolean {
  const pareja: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const pila: string[] = [];

  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') {
      pila.push(c);
    } else {
      // c es un cierre: debe casar con la cima de la pila
      if (pila.pop() !== pareja[c]) return false;
    }
  }

  return pila.length === 0;
}
```

Los tres casos de fallo, y dónde los captura el código:

1. **Cierre sin apertura** (`")"`): `pila.pop()` devuelve `undefined` ≠ `"("` → false.
2. **Tipos cruzados** (`"([)]"`): al llegar `)` la cima es `[` → false.
3. **Apertura sin cierre** (`"("`): el bucle acaba con la pila no vacía → el `return` final lo detecta.

**Complejidad**: O(n) en tiempo, O(n) en espacio en el peor caso (todo aperturas).

Si quieres profundizar en por qué la pila es la estructura correcta aquí, repasa el tema de [pilas y colas](/temas/estructuras-de-datos/pilas-y-colas/).

</details>
