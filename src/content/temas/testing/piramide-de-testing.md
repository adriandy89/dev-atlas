---
title: La pirámide de testing
description: Cuántos tests de cada tipo escribir, qué comprueba cada nivel y cómo evitar los tests que estorban más de lo que ayudan.
category: testing
level: fundamentos
tags: [tests-unitarios, integracion, e2e]
updated: 2026-07-22
order: 1
---

Testear no va de alcanzar un porcentaje de cobertura: va de **poder cambiar el código sin miedo**. La pirámide de testing es la heurística clásica para decidir cuántos tests de cada tipo escribir — y por qué la mayoría deberían ser baratos.

## Los tres niveles

<div class="w-diagram">
<svg viewBox="0 0 460 240" role="img" aria-label="Pirámide con tres niveles: muchos tests unitarios en la base, tests de integración en el medio y pocos E2E en la cima.">
<polygon class="w-node" points="196,18 264,18 296,84 164,84"></polygon><text class="w-node-label" x="230" y="58" text-anchor="middle">E2E</text>
<polygon class="w-node" points="158,96 302,96 336,162 124,162"></polygon><text class="w-node-label" x="230" y="126" text-anchor="middle">Integración</text><text class="w-node-sub" x="230" y="146" text-anchor="middle">módulos juntos, BD real</text>
<polygon class="w-node-accent" points="118,174 342,174 378,232 82,232"></polygon><text class="w-node-label" x="230" y="200" text-anchor="middle">Unitarios</text><text class="w-node-sub" x="230" y="220" text-anchor="middle">rápidos · deterministas · muchos</text>
<text class="w-node-sub" x="404" y="55">lentos, frágiles</text>
<text class="w-node-sub" x="404" y="225">milisegundos</text>
</svg>
<p class="w-diagram-cap">Cuanto más arriba, más realista es el test — y más lento, más frágil y más caro de mantener. Por eso la base es ancha.</p>
</div>

- **Unitarios**: prueban una unidad (función, clase) **aislada**. Corren en milisegundos y señalan el fallo con precisión de bisturí.
- **Integración**: prueban varias piezas juntas — tu repositorio contra una base de datos real, tu API con el framework de verdad. Detectan lo que los unitarios no pueden: que las piezas no encajan.
- **E2E (extremo a extremo)**: simulan al usuario real (un navegador controlado por Playwright/Cypress). Máxima confianza, máximo coste: lentos, con fallos intermitentes, caros de depurar.

## Un test unitario que enseña

```ts
import { describe, it, expect } from 'vitest';
import { aplicarDescuento } from './carrito';

describe('aplicarDescuento', () => {
  it('aplica el porcentaje sobre el total', () => {
    expect(aplicarDescuento(100, 10)).toBe(90);
  });

  it('rechaza descuentos fuera de rango', () => {
    expect(() => aplicarDescuento(100, 150)).toThrow(RangeError);
  });

  it('no deja el total en negativo por redondeo', () => {
    expect(aplicarDescuento(0.03, 99)).toBeGreaterThanOrEqual(0);
  });
});
```

Fíjate en el patrón de cada test — **preparar, actuar, afirmar** (Arrange-Act-Assert) — y en que cada uno prueba **un solo motivo de fallo**. Cuando `aplicarDescuento` se rompa, el nombre del test que falla te dice qué se rompió sin abrir el código.

## Las cuatro propiedades de un buen test

1. **Rápido** — una suite que tarda 20 minutos es una suite que nadie ejecuta antes de hacer push.
2. **Determinista** — mismo código, mismo resultado. Un test que a veces pasa y a veces falla (*flaky*) entrena al equipo a ignorar los rojos: es peor que no tenerlo.
3. **Aislado** — no depende del orden de ejecución ni de estado compartido con otros tests.
4. **Legible como especificación** — el nombre dice el comportamiento: `rechaza descuentos fuera de rango`, no `test2`.

<aside class="callout callout-truco">
<p class="callout-titulo">Truco</p>

Prueba **comportamiento, no implementación**. Si un test se rompe cuando refactorizas sin cambiar lo que el código hace, el test estaba mirando por la ventana equivocada. Regla práctica: afirma sobre lo que la función **devuelve o provoca**, no sobre qué métodos internos llamó.
</aside>

## Antipatrones que reconocerás

- **El cono de helado**: la pirámide invertida — cientos de E2E lentos, cuatro unitarios. Suele nacer de "testear al final" en lugar de mientras se desarrolla.
- **Mockear hasta el infinito**: si un test tiene 30 líneas de mocks y 2 de aserciones, ya no prueba tu código — prueba tus mocks. Señal de que la unidad tiene demasiadas dependencias (problema de diseño, no de testing).
- **Cobertura como objetivo**: el 100% de cobertura con aserciones vacías es un número verde que no protege nada. La cobertura señala qué **no** está probado; no certifica lo que sí.
- **Tests que duplican el código**: `expect(sumar(2, 2)).toBe(2 + 2)` no prueba nada — reimplementa. Usa valores literales esperados.

## ¿Y TDD?

Test-Driven Development invierte el orden: escribes primero un test que falla (**rojo**), el código mínimo que lo pasa (**verde**), y luego limpias (**refactor**). No es obligatorio para tener buenos tests, pero el ciclo corto obliga a diseñar unidades pequeñas y testeables desde el principio — muchos de sus beneficios son de **diseño**, no de testing. Pruébalo en katas antes de decidir si es para ti.

Los tests son la red que hace posible [refactorizar sin miedo](/temas/buenas-practicas/principio-dry/) — sin ellos, toda mejora de código es un acto de fe.

<div data-widget="mini-quiz" data-count="3"></div>
