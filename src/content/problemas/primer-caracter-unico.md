---
title: Primer carácter único
description: Encuentra el primer carácter que no se repite en una cadena, en tiempo lineal.
difficulty: facil
category: estructuras-de-datos
tags: [tablas-hash, cadenas]
hints:
  - 'La solución ingenua compara cada carácter con todos los demás: O(n²). ¿Qué estructura te da conteos en O(1)?'
  - 'Piensa en dos pasadas: una para contar, otra para decidir.'
  - 'En la segunda pasada, el primer carácter cuyo conteo sea 1 es la respuesta — el orden lo da la cadena, no el mapa.'
updated: 2026-07-22
---

Dada una cadena, devuelve el **índice del primer carácter que aparece exactamente una vez** — o `-1` si todos se repiten.

## Ejemplos

```
primerUnico("devatlas")   → 0   // la "d" no se repite
primerUnico("aabbcdd")    → 4   // la "c"
primerUnico("aabbcc")     → -1
primerUnico("")           → -1
```

Es el patrón "contar y decidir" en su forma más pura — el mismo que usarás para anagramas, frecuencias de palabras o detectar duplicados. Refresca cómo consigue una tabla hash sus conteos en O(1):

<div data-widget="hash-table" data-buckets="8"></div>

<details class="solucion">
<summary>Ver solución</summary>

Dos pasadas con un mapa de conteos — la primera cuenta, la segunda respeta el orden de la cadena:

```ts
function primerUnico(s: string): number {
  const conteo = new Map<string, number>();

  // Pasada 1: contar cada carácter — O(n)
  for (const c of s) {
    conteo.set(c, (conteo.get(c) ?? 0) + 1);
  }

  // Pasada 2: el primero con conteo 1, en el orden de la cadena — O(n)
  let i = 0;
  for (const c of s) {
    if (conteo.get(c) === 1) return i;
    i++;
  }

  return -1;
}
```

Los puntos que importan:

- **¿Por qué dos pasadas y no una?** Porque "único" es una propiedad global: hasta no ver la cadena entera no sabes si la `d` inicial se repetirá más adelante. Una sola pasada no puede responder.
- **El orden lo da la segunda pasada sobre la cadena**, no el mapa. (En JavaScript los `Map` sí conservan orden de inserción, pero apoyarse en eso hace la solución menos portable a otros lenguajes — y el recorrido de la cadena expresa la intención.)
- El bucle usa `for...of` con un índice manual en lugar de `s[i]` para no partir en dos los caracteres fuera del plano básico Unicode (emoji, por ejemplo).

**Complejidad**: O(n) en tiempo (dos pasadas lineales), O(k) en espacio, donde k es el número de caracteres distintos — con alfabetos acotados, O(1) en la práctica.

La solución O(n²) por fuerza bruta y esta se diferencian exactamente en lo que explica el tema de [tablas hash](/temas/estructuras-de-datos/tablas-hash/): pagar O(n) de memoria para convertir búsquedas repetidas en accesos O(1).

</details>
