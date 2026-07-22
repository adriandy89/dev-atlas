---
title: Strategy
description: El patrón que convierte una cadena de if/else en piezas intercambiables — y la forma más directa de cumplir el principio abierto/cerrado.
category: patrones-de-diseno
level: intermedio
tags: [comportamiento, polimorfismo, ocp]
updated: 2026-07-22
order: 3
---

Strategy es un patrón de **comportamiento**: encapsula una familia de algoritmos intercambiables detrás de una interfaz común, de modo que el código que los usa (el *contexto*) no sabe — ni le importa — cuál está ejecutando. Es, probablemente, el patrón con mejor relación sencillez/impacto de todo el catálogo.

## El problema: el `switch` que no deja de crecer

```ts
function calcularEnvio(pedido: Pedido, metodo: string): number {
  if (metodo === 'estandar') {
    return pedido.peso * 0.5;
  } else if (metodo === 'exprés') {
    return pedido.peso * 1.2 + 5;
  } else if (metodo === 'recogida') {
    return 0;
  }
  throw new Error(`método desconocido: ${metodo}`);
}
```

Hoy son tres ramas. Cada transportista nuevo **modifica esta función** — y de paso toca un fichero que ya funcionaba, con su riesgo de regresión. Si el mismo `switch` sobre `metodo` aparece además en la validación y en la UI, tienes el mismo conocimiento repetido en tres sitios: el problema exacto del que habla [DRY](/temas/buenas-practicas/principio-dry/).

## La solución: algoritmos como valores

Cada rama se convierte en una **estrategia** con la misma firma, y el `switch` en un mapa:

```ts
type EstrategiaEnvio = (pedido: Pedido) => number;

const estrategias: Record<string, EstrategiaEnvio> = {
  estandar: (p) => p.peso * 0.5,
  expres: (p) => p.peso * 1.2 + 5,
  recogida: () => 0,
};

function calcularEnvio(pedido: Pedido, metodo: string): number {
  const estrategia = estrategias[metodo];
  if (!estrategia) throw new Error(`método desconocido: ${metodo}`);
  return estrategia(pedido);
}
```

<div class="w-diagram">
<svg viewBox="0 0 460 190" role="img" aria-label="Un contexto delega en una interfaz de estrategia, con tres implementaciones intercambiables debajo.">
<defs><marker id="st-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="14" y="66" width="140" height="58" rx="11"></rect><text class="w-node-label" x="84" y="90" text-anchor="middle">Contexto</text><text class="w-node-sub" x="84" y="110" text-anchor="middle">calcularEnvio()</text>
<rect class="w-node-accent" x="220" y="66" width="130" height="58" rx="11"></rect><text class="w-node-label" x="285" y="90" text-anchor="middle">Estrategia</text><text class="w-node-sub" x="285" y="110" text-anchor="middle">(pedido) → precio</text>
<rect class="w-node" x="322" y="8" width="124" height="38" rx="9"></rect><text class="w-node-label" x="384" y="32" text-anchor="middle">estándar</text>
<rect class="w-node" x="386" y="76" width="66" height="38" rx="9"></rect><text class="w-node-label" x="419" y="100" text-anchor="middle">exprés</text>
<rect class="w-node" x="322" y="144" width="124" height="38" rx="9"></rect><text class="w-node-label" x="384" y="168" text-anchor="middle">recogida</text>
<line class="w-edge" x1="154" y1="95" x2="216" y2="95" marker-end="url(#st-arw)"></line>
<line class="w-edge" x1="350" y1="76" x2="368" y2="42" marker-end="url(#st-arw)"></line>
<line class="w-edge" x1="350" y1="95" x2="382" y2="95" marker-end="url(#st-arw)"></line>
<line class="w-edge" x1="350" y1="114" x2="368" y2="148" marker-end="url(#st-arw)"></line>
</svg>
<p class="w-diagram-cap">El contexto conoce la interfaz, nunca las implementaciones. Añadir una estrategia no toca al contexto: eso es el principio abierto/cerrado en acción.</p>
</div>

Añadir un transportista ahora es **añadir una entrada al mapa** — el contexto queda intacto. El sistema está *abierto a extensión, cerrado a modificación*: acabas de ver el principio **abierto/cerrado** de [SOLID](/temas/buenas-practicas/principios-solid/) funcionando, no en un eslogan.

En un lenguaje sin funciones de primera clase, cada estrategia sería una clase con un método (`interface EstrategiaEnvio { calcular(p: Pedido): number }`). En JavaScript/TypeScript, **las funciones ya son objetos**: el patrón se disuelve en el lenguaje, pero la idea — y el nombre para comunicarla — sigue siendo la misma.

## Ya lo usas todos los días

- `arr.sort((a, b) => a.precio - b.precio)` — el comparador **es una estrategia** que le inyectas al algoritmo de ordenación.
- `map`, `filter`, `reduce` — cada callback es la estrategia de qué hacer con cada elemento.
- Pasarelas de pago, proveedores de login (Google/GitHub/email), formatos de exportación (CSV/JSON/PDF): un contrato, N implementaciones.
- La compresión de tu servidor HTTP (gzip/brotli según el cliente).

## Strategy y sus vecinos

- **vs. [Observer](/temas/patrones-de-diseno/observer/)**: Strategy elige *cómo* se hace una cosa (1 colaborador); Observer notifica *que* algo pasó (N interesados).
- **con Factory**: ¿de dónde sale la estrategia correcta según la configuración? De una [fábrica](/temas/patrones-de-diseno/factory/) — los dos patrones suelen trabajar en pareja: la fábrica elige, la estrategia ejecuta.

<aside class="callout callout-truco">
<p class="callout-titulo">Truco</p>

La señal para introducir Strategy no es "hay un if" — es un `if/else` o `switch` sobre el **mismo criterio** que se repite, crece con el negocio, o necesita variantes que hoy no existen (tests con una estrategia falsa, un plan premium con otra tarifa). Para dos casos estables, el `if` es más simple y más honesto: no todo condicional pide un patrón.
</aside>

<div data-widget="mini-quiz" data-count="3"></div>
