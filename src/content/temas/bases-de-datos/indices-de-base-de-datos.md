---
title: Índices de base de datos
description: Por qué una consulta pasa de segundos a milisegundos con un índice, cómo funcionan por dentro y cuándo un índice no te salva.
category: bases-de-datos
level: fundamentos
tags: [sql, indices, rendimiento, b-tree]
updated: 2026-07-22
order: 1
---

Sin índice, buscar una fila es leer la tabla entera — un **full scan**: con 10 millones de usuarios, tu `WHERE email = ...` recorre 10 millones de filas para devolver una. El índice es la diferencia entre segundos y milisegundos, y entenderlo es la mejora de rendimiento con mejor relación esfuerzo/resultado que existe en bases de datos.

## La idea: el índice de un libro

Un índice es una **estructura ordenada aparte** que mapea valores de una columna → dónde está su fila. Igual que el índice alfabético de un libro: no relees el libro para encontrar "recursión"; saltas a la R, y de ahí a la página.

Y en una estructura ordenada se busca con la estrategia que ya conoces — descartando mitades:

<div data-widget="binary-search" data-array="3,9,14,21,30,38,45,52,61,77" data-target="45"></div>

La [búsqueda binaria](/temas/algoritmos/busqueda-binaria/) sobre ese índice encuentra 1 valor entre millones en ~20 saltos. Esa es toda la magia: **O(log n) en lugar de O(n)**.

## B-tree: búsqueda binaria adaptada a disco

Los índices reales usan **árboles B (B-trees)**: como un árbol binario de búsqueda, pero cada nodo agrupa cientos de claves — porque leer de disco va por bloques, y conviene aprovechar cada lectura al máximo. Resultado: un árbol de 3–4 niveles cubre miles de millones de filas.

<div class="w-diagram">
<svg viewBox="0 0 460 210" role="img" aria-label="Árbol B de tres niveles: una raíz dirige a nodos intermedios y estos a las hojas que apuntan a las filas.">
<defs><marker id="bt-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node-accent" x="180" y="10" width="100" height="38" rx="9"></rect><text class="w-node-label" x="230" y="34" text-anchor="middle">≤ 40 | &gt; 40</text>
<rect class="w-node" x="60" y="86" width="110" height="38" rx="9"></rect><text class="w-node-label" x="115" y="110" text-anchor="middle">9 · 21 · 38</text>
<rect class="w-node" x="290" y="86" width="110" height="38" rx="9"></rect><text class="w-node-label" x="345" y="110" text-anchor="middle">45 · 61 · 77</text>
<rect class="w-node" x="24" y="162" width="180" height="36" rx="9"></rect><text class="w-node-sub" x="114" y="185" text-anchor="middle">hojas → filas de la tabla</text>
<rect class="w-node" x="256" y="162" width="180" height="36" rx="9"></rect><text class="w-node-sub" x="346" y="185" text-anchor="middle">hojas → filas de la tabla</text>
<line class="w-edge" x1="205" y1="50" x2="130" y2="82" marker-end="url(#bt-arw)"></line>
<line class="w-edge" x1="255" y1="50" x2="330" y2="82" marker-end="url(#bt-arw)"></line>
<line class="w-edge" x1="115" y1="126" x2="114" y2="158" marker-end="url(#bt-arw)"></line>
<line class="w-edge" x1="345" y1="126" x2="346" y2="158" marker-end="url(#bt-arw)"></line>
</svg>
<p class="w-diagram-cap">Buscar 45: raíz (&gt;40 → derecha) → nodo intermedio → hoja. Tres lecturas en lugar de millones.</p>
</div>

Como las hojas están **ordenadas y enlazadas**, el mismo índice también acelera rangos (`WHERE fecha >= ...`), `ORDER BY` y `LIMIT` — no solo igualdades.

## Crear el índice correcto

```sql
-- La consulta lenta:
SELECT * FROM usuarios WHERE email = 'ana@ejemplo.com';

-- El arreglo (y garantiza unicidad de paso):
CREATE UNIQUE INDEX idx_usuarios_email ON usuarios (email);
```

Con varias columnas, el **orden dentro del índice importa** — es una guía telefónica ordenada por apellido y luego nombre:

```sql
CREATE INDEX idx_pedidos_cliente_fecha ON pedidos (cliente_id, fecha);

-- ✅ usa el índice: filtra por la primera columna (y la segunda)
SELECT * FROM pedidos WHERE cliente_id = 42 AND fecha > '2026-01-01';
-- ✅ usa el índice: prefijo del índice
SELECT * FROM pedidos WHERE cliente_id = 42;
-- ❌ NO lo aprovecha: busca "todos los García" sin saber el apellido... al revés
SELECT * FROM pedidos WHERE fecha > '2026-01-01';
```

Regla del **prefijo izquierdo**: un índice `(a, b)` sirve para consultas por `a` o por `a y b`, pero no por `b` sola.

## Cuando el índice existe y no se usa

Estas consultas ignoran un índice sobre `email` o `fecha` aunque lo tengas:

```sql
-- ❌ Función sobre la columna: el índice guarda email, no LOWER(email)
WHERE LOWER(email) = 'ana@ejemplo.com'
-- ❌ Comodín al principio: no hay prefijo por el que navegar el árbol
WHERE email LIKE '%@gmail.com'
-- ❌ Aritmética sobre la columna
WHERE precio * 1.21 > 100
```

Las soluciones: índice funcional (`CREATE INDEX ... ON usuarios (LOWER(email))`), reescribir la condición (`precio > 100 / 1.21`), o para búsqueda de texto, un índice de texto completo.

<aside class="callout callout-truco">
<p class="callout-titulo">Truco</p>

No adivines: pregunta. `EXPLAIN ANALYZE SELECT ...` te dice exactamente qué plan eligió la base de datos — si lees `Seq Scan` sobre una tabla grande donde esperabas `Index Scan`, ya sabes qué arreglar. Es la herramienta número uno de rendimiento en SQL.
</aside>

## El precio: las escrituras

Un índice no es gratis. Cada `INSERT`, `UPDATE` o `DELETE` debe actualizar **todos los índices** de la tabla, y cada índice ocupa disco (a veces tanto como la tabla). Por eso:

- Indexa lo que tus consultas **realmente filtran, unen u ordenan** — las columnas de tus `WHERE`, `JOIN` y `ORDER BY` frecuentes.
- No indexes "por si acaso": una tabla con 12 índices escribe 13 veces por cada fila.
- Revisa los índices sin uso (las bases de datos llevan estadísticas) y bórralos.

La regla mental: los índices convierten **lecturas O(n) en O(log n)** a cambio de **escrituras algo más lentas**. En la mayoría de aplicaciones — que leen mucho más de lo que escriben — es el mejor trato de la casa.

<div data-widget="mini-quiz" data-count="3"></div>
