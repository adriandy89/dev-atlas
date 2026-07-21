---
title: Notación Big-O
description: Qué mide la notación Big-O, cómo leerla y las clases de complejidad que aparecen una y otra vez.
category: algoritmos
level: fundamentos
tags: [complejidad, rendimiento, fundamentos]
updated: 2026-07-21
order: 1
---

La notación Big-O describe **cómo crece el coste de un algoritmo cuando crece la entrada**. No mide segundos: mide la *forma* del crecimiento. Un algoritmo O(n) sobre un array de un millón de elementos hace del orden de un millón de operaciones; uno O(log n), unas veinte.

## Qué mide exactamente

Big-O expresa una cota superior del crecimiento en el **peor caso**, ignorando constantes y términos menores:

- `3n² + 5n + 20` → **O(n²)**: para n grande, el término cuadrático domina.
- Recorrer un array dos veces seguidas es `2n` → **O(n)**: las constantes no cambian la forma.

Por eso dos algoritmos O(n) pueden tener rendimientos reales muy distintos. Big-O sirve para comparar *estrategias*, no implementaciones concretas.

## Las clases que debes reconocer

| Clase | Nombre | Ejemplo típico |
| --- | --- | --- |
| O(1) | Constante | Acceso a un índice de un array |
| O(log n) | Logarítmica | Búsqueda binaria |
| O(n) | Lineal | Recorrer una lista |
| O(n log n) | Casi lineal | Mergesort, quicksort medio |
| O(n²) | Cuadrática | Doble bucle anidado |
| O(2ⁿ) | Exponencial | Subconjuntos por fuerza bruta |

## Cómo estimarla leyendo código

Reglas rápidas que resuelven la mayoría de los casos:

```ts
// O(n): un bucle proporcional a la entrada
for (const x of items) hacerAlgo(x);

// O(n²): bucle dentro de bucle sobre la misma entrada
for (const a of items) for (const b of items) comparar(a, b);

// O(n + m): bucles consecutivos sobre entradas distintas — se suman
for (const a of listaA) procesar(a);
for (const b of listaB) procesar(b);

// O(log n): el problema se parte a la mitad en cada paso
while (n > 1) n = Math.floor(n / 2);
```

### No solo tiempo: también memoria

La **complejidad espacial** usa la misma notación para la memoria extra. Invertir un array in situ es O(1) en espacio; construir uno nuevo es O(n). En sistemas con memoria limitada, esta dimensión importa tanto como la temporal.

## Errores comunes

- **Optimizar sin medir.** Big-O orienta el diseño, pero el cuello de botella real se encuentra con un profiler.
- **Ignorar el tamaño real de n.** Para n = 20, un O(n²) simple puede ganar a un O(n log n) con constantes grandes.
- **Confundir peor caso con caso medio.** Quicksort es O(n²) en el peor caso pero O(n log n) de media, y en la práctica es excelente.

Dominar Big-O es el requisito para todo lo demás en esta categoría: cuando compares [búsqueda binaria](/temas/algoritmos/busqueda-binaria/) con una búsqueda lineal, la notación te dirá exactamente qué estás ganando.
