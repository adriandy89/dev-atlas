---
title: Invertir una cadena
description: Invierte una cadena sin usar reverse() — dos punteros y una trampa con los emojis.
difficulty: facil
category: algoritmos
tags: [cadenas, dos-punteros]
hints:
  - Convierte la cadena en array de caracteres; las cadenas en JavaScript son inmutables.
  - Dos punteros, uno en cada extremo, intercambiando y avanzando hacia el centro.
updated: 2026-07-21
---

Escribe una función que invierta una cadena **sin usar** `Array.prototype.reverse()`.

## Ejemplos

```
invertir("atlas")   → "salta"
invertir("hola")    → "aloh"
invertir("a")       → "a"
```

Extra: ¿qué pasa si la cadena contiene emojis como `"mapa🗺️"`? Pruébalo con tu solución.

<details class="solucion">
<summary>Ver solución</summary>

El patrón de **dos punteros**: intercambiar extremos y avanzar hacia el centro.

```ts
function invertir(s: string): string {
  const chars = [...s]; // el spread separa por code points, no por unidades UTF-16
  let i = 0;
  let j = chars.length - 1;
  while (i < j) {
    [chars[i], chars[j]] = [chars[j], chars[i]];
    i++;
    j--;
  }
  return chars.join('');
}
```

**La trampa de los emojis**: `s.split('')` corta por unidades UTF-16 y rompe caracteres fuera del plano básico (un emoji son 2 unidades: los llamados pares subrogados). `[...s]` itera por *code points* y los conserva. (Los emojis compuestos con ZWJ, como 👨‍👩‍👧, siguen rompiéndose — resolver eso requiere segmentación de grafemas con `Intl.Segmenter`.)

**Complejidad**: O(n) en tiempo, O(n) en espacio — en JavaScript no hay inversión in situ posible porque las cadenas son inmutables; en C o Rust con buffers mutables sería O(1) de espacio extra.

</details>
