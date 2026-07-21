---
title: El principio DRY (y cuándo no aplicarlo)
description: Don't Repeat Yourself bien entendido — duplicación de conocimiento, no de líneas, y el coste de la abstracción prematura.
category: buenas-practicas
level: intermedio
tags: [clean-code, abstraccion, refactorizacion]
updated: 2026-07-21
order: 2
---

DRY — *Don't Repeat Yourself* — es probablemente el principio más citado y peor aplicado del desarrollo de software. Su formulación original (The Pragmatic Programmer) no habla de líneas repetidas: dice que **cada pieza de conocimiento debe tener una representación única y autoritativa en el sistema**.

## Qué es duplicación de verdad

La regla "el IVA es el 21%" escrita en el backend, en el frontend y en un informe SQL es duplicación de **conocimiento**: cuando cambie, alguien olvidará uno de los tres sitios. Eso es lo que DRY prohíbe.

```ts
// Conocimiento duplicado: la regla vive en dos sitios
const totalConIva = subtotal * 1.21;            // checkout.ts
const importeFactura = base * 1.21;             // facturas.ts

// DRY: una única fuente de la regla
export const IVA_GENERAL = 0.21;
export const conIva = (importe: number) => importe * (1 + IVA_GENERAL);
```

## La duplicación que es solo coincidencia

Dos fragmentos pueden ser **idénticos hoy y conceptualmente distintos**: la validación de "el DNI del cliente" y la de "el DNI del empleado" pueden coincidir carácter a carácter y aún así evolucionar por razones distintas. Si las unificas, el día que una cambie tendrás un `if (esEmpleado)` dentro de la función común — y esa función empezará a mentir.

La pregunta correcta no es "¿se parecen?", sino: **si una cambia, ¿la otra DEBE cambiar con ella?** Solo si la respuesta es sí, es la misma pieza de conocimiento.

## El coste de abstraer antes de tiempo

Cada abstracción es una apuesta: pagas indirección hoy a cambio de un único punto de cambio mañana. Si la apuesta falla, el precio es alto — de ahí dos heurísticas que la equilibran:

- **La regla de tres**: con dos apariciones, tolera la duplicación; a la tercera, ya conoces la forma real del patrón y puedes extraerlo bien.
- **AHA** (*Avoid Hasty Abstractions*): "prefiere la duplicación a la abstracción equivocada" (Sandi Metz). Deshacer una abstracción incorrecta con seis consumidores cuesta mucho más que unificar tres copias.

## DRY más allá del código

El principio aplica a todo el sistema de conocimiento del proyecto:

- **Esquemas**: generar tipos desde el esquema de la base de datos o del API (OpenAPI, Prisma) en lugar de mantenerlos a mano en paralelo.
- **Configuración**: un valor por entorno en un solo sitio, no esparcido por scripts.
- **Documentación**: el README que repite lo que dice el código envejece mal; documenta el *porqué*, enlaza al código para el *cómo*.

## En resumen

- Unifica **reglas de negocio y conocimiento**: ahí DRY es innegociable.
- Tolera parecidos **accidentales**: espera a la tercera aparición.
- Si al extraer necesitas parámetros booleanos para distinguir a los llamadores, probablemente uniste cosas que no eran lo mismo.

El complemento natural de este criterio es saber [nombrar lo que extraes](/temas/buenas-practicas/nombres-significativos/): una abstracción que no tiene buen nombre suele ser una abstracción que no existe.
