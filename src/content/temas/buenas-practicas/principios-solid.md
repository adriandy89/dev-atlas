---
title: Los principios SOLID
description: Cinco heurísticas sobre cómo repartir responsabilidades y dependencias para que el cambio no duela — con su letra pequeña.
category: buenas-practicas
level: intermedio
tags: [solid, diseno, acoplamiento]
updated: 2026-07-22
order: 3
---

SOLID son cinco principios sobre la misma pregunta: **¿cómo organizo el código para que cambiarlo no sea peligroso?** No son leyes — son heurísticas destiladas de décadas de mantenimiento doloroso. Entendidos como brújula funcionan; recitados como dogma producen arquitecturas de encaje de bolillos. Vamos con ambos.

## S — Responsabilidad única (SRP)

> Un módulo debería tener **un solo motivo para cambiar**.

El motivo de cambio lo definen las personas: si contabilidad puede pedirte cambios en una clase, y también diseño, y también sistemas, esa clase tiene tres responsabilidades:

```ts
// ❌ Tres motivos de cambio en una clase
class Informe {
  calcularTotales() {} // cambia si cambian las reglas de negocio
  formatearHTML() {}   // cambia si cambia el diseño
  guardarEnDisco() {}  // cambia si cambia la infraestructura
}

// ✅ Un motivo por pieza: calculadora, presentador, repositorio
```

La señal de violación más fiable no es el tamaño — es la palabra **"y"** al describir qué hace: "calcula los totales *y* los formatea *y* los guarda".

## O — Abierto/cerrado (OCP)

> Abierto a **extensión**, cerrado a **modificación**: añadir un caso nuevo no debería tocar código que ya funciona.

Es el principio que viste funcionando en [Strategy](/temas/patrones-de-diseno/strategy/): el `switch` de métodos de envío que crece por dentro *viola* OCP; el mapa de estrategias donde añades una entrada *lo cumple*. No significa "no modifiques nunca nada" — significa que los **puntos de variación previsibles** merecen una costura para extender sin operar a corazón abierto.

## L — Sustitución de Liskov (LSP)

> Donde el código espera el tipo base, cualquier subtipo debe funcionar **sin sorpresas**.

```ts
class Ave { }
class Aguila extends Ave { volar() { /* ... */ } }
class Pinguino extends Ave {
  volar() { throw new Error('los pingüinos no vuelan'); } // ❌ bomba de relojería
}
```

Todo el que reciba un `Ave` y la haga volar explotará con un pingüino — la jerarquía miente. LSP dice que **la herencia se define por el contrato observable, no por el parecido del mundo real**: si un subtipo necesita lanzar donde el padre prometía funcionar, endurecer precondiciones o devolver menos, el modelo está mal cortado (aquí: `Ave` y `AveVoladora` separadas, o composición en lugar de herencia).

## I — Segregación de interfaces (ISP)

> Nadie debería verse obligado a depender de métodos que no usa.

Una interfaz `Impresora` con `imprimir()`, `escanear()` y `enviarFax()` obliga a la impresora básica a implementar (¿lanzando?) dos métodos que no tiene — que es exactamente el problema de Liskov, fabricado en la interfaz. Interfaces pequeñas y componibles (`Imprime`, `Escanea`) dejan que cada clase firme solo lo que cumple, y que cada consumidor pida solo lo que necesita.

## D — Inversión de dependencias (DIP)

> Las políticas de alto nivel no dependen de detalles: **ambos dependen de abstracciones**.

<div class="w-diagram">
<svg viewBox="0 0 460 170" role="img" aria-label="Sin inversión, el dominio depende de la base de datos. Con inversión, el dominio define una interfaz que la base de datos implementa.">
<defs><marker id="di-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<text class="w-node-sub" x="105" y="24" text-anchor="middle">sin invertir</text>
<rect class="w-node" x="40" y="36" width="130" height="42" rx="9"></rect><text class="w-node-label" x="105" y="62" text-anchor="middle">Dominio</text>
<rect class="w-node" x="40" y="112" width="130" height="42" rx="9"></rect><text class="w-node-label" x="105" y="138" text-anchor="middle">Postgres</text>
<line class="w-edge" x1="105" y1="78" x2="105" y2="108" marker-end="url(#di-arw)"></line>
<text class="w-node-sub" x="345" y="24" text-anchor="middle">invertido ✓</text>
<rect class="w-node-accent" x="280" y="36" width="130" height="42" rx="9"></rect><text class="w-node-label" x="345" y="55" text-anchor="middle">Dominio</text><text class="w-node-sub" x="345" y="71" text-anchor="middle">define «Repositorio»</text>
<rect class="w-node" x="280" y="112" width="130" height="42" rx="9"></rect><text class="w-node-label" x="345" y="138" text-anchor="middle">Postgres</text>
<line class="w-edge" x1="345" y1="108" x2="345" y2="82" marker-end="url(#di-arw)"></line>
</svg>
<p class="w-diagram-cap">La flecha se da la vuelta: el detalle implementa la interfaz que el dominio posee. Quien define el contrato manda.</p>
</div>

Es la [regla de dependencia de la arquitectura en capas](/temas/arquitectura/arquitectura-en-capas/) formulada como principio — y la razón práctica de que puedas testear tu dominio pasándole un repositorio falso. La "inyección de dependencias" es solo la mecánica de entregar la implementación; la inversión es la idea.

## La letra pequeña

<aside class="callout callout-aviso">
<p class="callout-titulo">Aviso</p>

Cada principio tiene un coste: SRP multiplicado sin criterio da cien clases de una línea; OCP anticipado da capas de abstracción para variaciones que nunca llegan (**YAGNI**); DIP en todo da interfaces con una sola implementación para siempre. SOLID te dice **dónde poner las costuras cuando el cambio es real o probable** — no que todo el código deba estar acolchado. La habilidad senior no es aplicarlos: es saber cuándo no.
</aside>

Si te quedas con una sola frase: **el código sano tiene piezas con un propósito claro, y las flechas de dependencia apuntan de lo concreto hacia lo estable**. Los cinco principios son variaciones de esa frase — igual que [DRY](/temas/buenas-practicas/principio-dry/) y los [nombres significativos](/temas/buenas-practicas/nombres-significativos/) son variaciones de "el código se escribe para quien lo lee".

<div data-widget="mini-quiz" data-count="3"></div>
