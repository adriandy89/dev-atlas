---
title: Búsqueda binaria
description: El algoritmo O(log n) para buscar en colecciones ordenadas, su implementación correcta y sus trampas clásicas.
category: algoritmos
level: fundamentos
tags: [busqueda, arrays, divide-y-venceras]
updated: 2026-07-21
order: 2
---

La búsqueda binaria encuentra un elemento en una colección **ordenada** descartando la mitad del espacio de búsqueda en cada paso. Donde una búsqueda lineal necesita hasta un millón de comparaciones, la binaria necesita como mucho 20 (log₂ de 1.000.000).

## La idea

1. Mira el elemento central.
2. Si es el buscado, termina.
3. Si el buscado es menor, repite en la mitad izquierda; si es mayor, en la derecha.

El requisito es innegociable: **el array debe estar ordenado**. Si no lo está, ordenarlo primero (O(n log n)) solo compensa cuando vas a buscar muchas veces.

## Implementación

```ts
function busquedaBinaria(arr: number[], objetivo: number): number {
  let izquierda = 0;
  let derecha = arr.length - 1;

  while (izquierda <= derecha) {
    // Evita el desbordamiento de (izquierda + derecha) / 2 en otros lenguajes
    const medio = izquierda + Math.floor((derecha - izquierda) / 2);

    if (arr[medio] === objetivo) return medio;
    if (arr[medio] < objetivo) izquierda = medio + 1;
    else derecha = medio - 1;
  }

  return -1; // no encontrado
}
```

## Las trampas clásicas

### Errores off-by-one

Casi todos los bugs de búsqueda binaria están en tres decisiones que deben ser coherentes entre sí:

- **La condición del bucle**: `izquierda <= derecha` (con `<` a secas se salta el último candidato).
- **Los saltos**: `medio + 1` y `medio - 1`. Si dejas `derecha = medio`, con dos elementos iguales el bucle puede no avanzar y quedarse infinito.
- **El cálculo del medio**: en JavaScript `(a + b) / 2` no desborda, pero en Java/C/Go sí puede — de ahí la forma `izq + (der - izq) / 2`.

### Variantes que parecen iguales y no lo son

- *Primera aparición* de un valor repetido: al encontrarlo, sigue buscando a la izquierda.
- *Límite inferior* (lower bound): el primer índice cuyo valor es `>= objetivo` — la base de los rangos.
- *Buscar en array rotado*: primero decide qué mitad está ordenada.

Cada variante cambia una condición del esqueleto. Escribirlas desde cero es uno de los mejores ejercicios de precisión que existen.

## Dónde aparece en el mundo real

- `git bisect` busca el commit que rompió el build en O(log n) commits.
- Los índices B-tree de las bases de datos son búsqueda binaria generalizada a disco.
- Cualquier autocompletado sobre listas ordenadas.

Para entender el coste comparado con otras estrategias, repasa la [notación Big-O](/temas/algoritmos/notacion-big-o/).
