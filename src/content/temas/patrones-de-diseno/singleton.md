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
