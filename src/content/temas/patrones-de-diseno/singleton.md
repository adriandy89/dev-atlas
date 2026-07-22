---
title: Singleton
description: El patrón que garantiza una única instancia global — cómo implementarlo bien y por qué casi siempre hay una alternativa mejor.
category: patrones-de-diseno
level: intermedio
tags: [creacional, estado-global, antipatron]
updated: 2026-07-21
order: 1
---

Singleton es un patrón **creacional** que garantiza que una clase tenga una única instancia y ofrece un punto de acceso global a ella. Es el patrón más conocido — y también el más criticado, porque usado sin criterio introduce estado global encubierto.

## La implementación

```ts
class Configuracion {
  private static instancia: Configuracion | null = null;

  private constructor(readonly valores: Record<string, string>) {}

  static getInstancia(): Configuracion {
    if (Configuracion.instancia === null) {
      Configuracion.instancia = new Configuracion(cargarConfig());
    }
    return Configuracion.instancia;
  }
}

const config = Configuracion.getInstancia();
```

Las tres piezas: constructor **privado** (nadie más puede instanciar), campo estático con la instancia, y un método `getInstancia()` con inicialización perezosa.

<div class="w-diagram">
<svg viewBox="0 0 460 190" role="img" aria-label="Tres servicios acceden a una única instancia compartida de Configuración a través de getInstancia().">
<defs><marker id="sg-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="14" y="14" width="120" height="38" rx="9"></rect><text class="w-node-label" x="74" y="38" text-anchor="middle">Servicio A</text>
<rect class="w-node" x="14" y="76" width="120" height="38" rx="9"></rect><text class="w-node-label" x="74" y="100" text-anchor="middle">Servicio B</text>
<rect class="w-node" x="14" y="138" width="120" height="38" rx="9"></rect><text class="w-node-label" x="74" y="162" text-anchor="middle">Servicio C</text>
<rect class="w-node-accent" x="300" y="62" width="150" height="66" rx="11"></rect><text class="w-node-label" x="375" y="90" text-anchor="middle">Configuración</text><text class="w-node-sub" x="375" y="110" text-anchor="middle">instancia única</text>
<line class="w-edge" x1="134" y1="33" x2="298" y2="88" marker-end="url(#sg-arw)"></line>
<line class="w-edge" x1="134" y1="95" x2="298" y2="95" marker-end="url(#sg-arw)"></line>
<line class="w-edge" x1="134" y1="157" x2="298" y2="102" marker-end="url(#sg-arw)"></line>
</svg>
<p class="w-diagram-cap">Un único punto de acceso global: todos comparten la misma instancia.</p>
</div>

En lenguajes con hilos (Java, C#), la inicialización perezosa necesita sincronización — el clásico *double-checked locking*. En JavaScript el problema no existe por ser monohilo, y de hecho **un módulo ES ya es un singleton**: se evalúa una vez y se cachea.

```ts
// config.ts — singleton idiomático en JavaScript/TypeScript
export const config = cargarConfig();
```

## Por qué tiene mala fama

- **Estado global disfrazado.** Cualquier función puede leer y mutar la instancia sin declararlo en su firma. Los bugs se vuelven no locales: algo cambió la configuración "desde algún sitio".
- **Rompe la testabilidad.** El código que llama a `Configuracion.getInstancia()` dentro de sus funciones no puede recibir un doble de pruebas sin trucos (resetear estáticos entre tests, mocks de módulo).
- **Acopla al mecanismo, no al contrato.** Los consumidores dependen de una clase concreta y de *cómo* se obtiene, no de una interfaz.

## Cuándo sigue teniendo sentido

- Recursos físicamente únicos y costosos: un pool de conexiones, un logger, la caché de proceso.
- Cuando el ciclo de vida lo gestiona un **contenedor de inyección de dependencias** (NestJS, Spring): la clase se declara con *scope* singleton, pero los consumidores la reciben por constructor. Tienes la unicidad sin el acceso global — la mejor versión del patrón.

## La alternativa por defecto

Antes de escribir `getInstancia()`, pregúntate: ¿puedo **crear la instancia una vez en el arranque y pasarla como dependencia**? Eso conserva la unicidad, hace las dependencias explícitas y deja los tests triviales.

El patrón complementario para entender esta crítica es la inyección de dependencias; y si te interesa la comunicación entre objetos sin acoplarlos, sigue con [Observer](/temas/patrones-de-diseno/observer/).
