---
title: Recursión
description: Borrador — pensar problemas en términos de sí mismos, casos base y por qué toda recursión es una pila.
category: algoritmos
level: fundamentos
tags: [recursion, divide-y-venceras]
updated: 2026-07-21
order: 3
draft: true
---

> Borrador de ejemplo: este tema tiene `draft: true`, así que es visible en
> el servidor de desarrollo pero queda excluido del build de producción.

Una función recursiva se llama a sí misma sobre una versión más pequeña del problema hasta llegar a un **caso base**.

## Las dos piezas obligatorias

1. **Caso base**: la entrada tan pequeña que la respuesta es directa.
2. **Paso recursivo**: reducir el problema y confiar en que la llamada interior lo resuelve.

```ts
function factorial(n: number): number {
  if (n <= 1) return 1; // caso base
  return n * factorial(n - 1); // paso recursivo
}
```

*(Pendiente: pila de llamadas, recursión de cola, memoización y cuándo convertir a iterativo.)*
