---
title: Factory
description: Centralizar la creación de objetos para que el resto del código dependa de interfaces, no de constructores concretos.
category: patrones-de-diseno
level: intermedio
tags: [creacional, desacoplamiento]
updated: 2026-07-22
order: 4
---

Los patrones **creacionales** responden una pregunta que parece trivial hasta que el proyecto crece: *¿quién ejecuta el `new`?* Factory es la respuesta más usada: un único lugar que sabe **qué clase concreta construir**, para que el resto del código trabaje solo con la interfaz.

## El problema: `new` es acoplamiento

Cada `new ParserCSV()` esparcido por el código ata ese punto a una clase concreta. Y cuando la elección depende de un dato, el acoplamiento viene con su amigo el `switch` duplicado:

```ts
// Este switch aparece en importar(), en previsualizar(), en validar()…
let parser;
if (fichero.endsWith('.csv')) parser = new ParserCSV();
else if (fichero.endsWith('.json')) parser = new ParserJSON();
else if (fichero.endsWith('.xml')) parser = new ParserXML();
```

Soportar `.yaml` mañana significa cazar todos esos `switch`. Alguno se te escapará — y ese es el bug.

## La solución: un único lugar que decide

```ts
interface Parser {
  parsear(contenido: string): Registro[];
}

const constructores: Record<string, () => Parser> = {
  csv: () => new ParserCSV(),
  json: () => new ParserJSON(),
  xml: () => new ParserXML(),
};

function crearParser(fichero: string): Parser {
  const ext = fichero.split('.').pop() ?? '';
  const constructor = constructores[ext];
  if (!constructor) throw new Error(`formato no soportado: .${ext}`);
  return constructor();
}

// El código cliente ya no conoce ninguna clase concreta:
const registros = crearParser(fichero).parsear(contenido);
```

<div class="w-diagram">
<svg viewBox="0 0 460 190" role="img" aria-label="El cliente pide a la fábrica, que elige entre tres parsers concretos y devuelve la interfaz común.">
<defs><marker id="fa-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="14" y="66" width="120" height="58" rx="11"></rect><text class="w-node-label" x="74" y="90" text-anchor="middle">Cliente</text><text class="w-node-sub" x="74" y="110" text-anchor="middle">usa Parser</text>
<rect class="w-node-accent" x="196" y="66" width="130" height="58" rx="11"></rect><text class="w-node-label" x="261" y="90" text-anchor="middle">Fábrica</text><text class="w-node-sub" x="261" y="110" text-anchor="middle">crearParser(ext)</text>
<rect class="w-node" x="356" y="10" width="92" height="38" rx="9"></rect><text class="w-node-label" x="402" y="34" text-anchor="middle">CSV</text>
<rect class="w-node" x="362" y="76" width="86" height="38" rx="9"></rect><text class="w-node-label" x="405" y="100" text-anchor="middle">JSON</text>
<rect class="w-node" x="356" y="142" width="92" height="38" rx="9"></rect><text class="w-node-label" x="402" y="166" text-anchor="middle">XML</text>
<line class="w-edge" x1="134" y1="95" x2="192" y2="95" marker-end="url(#fa-arw)"></line>
<line class="w-edge" x1="326" y1="78" x2="352" y2="38" marker-end="url(#fa-arw)"></line>
<line class="w-edge" x1="326" y1="95" x2="358" y2="95" marker-end="url(#fa-arw)"></line>
<line class="w-edge" x1="326" y1="112" x2="352" y2="152" marker-end="url(#fa-arw)"></line>
</svg>
<p class="w-diagram-cap">La decisión "qué construir" vive en un solo sitio. El cliente pide por la interfaz; la fábrica es la única que conoce los nombres propios.</p>
</div>

Fíjate en la simetría con [Strategy](/temas/patrones-de-diseno/strategy/): el mapa de constructores **es** un mapa de estrategias de creación. La diferencia está en la intención — Factory decide *qué objeto nace*; Strategy decide *cómo se comporta uno que ya existe*. En la práctica van juntos: la fábrica elige la estrategia según la configuración.

## Las variantes, sin ceremonias

- **Función fábrica (simple factory)**: lo de arriba. Cubre el 90 % de los casos en JavaScript/TypeScript.
- **Factory Method** (el patrón GoF formal): la fábrica es un método que las **subclases** sobreescriben — el framework define *cuándo* se crea y cada extensión define *qué*. Lo has usado si has sobreescrito un `createConnection()` o un `render()` que devuelve el componente concreto.
- **Abstract Factory**: una fábrica de **familias completas** de objetos que deben ser coherentes entre sí (todos los widgets del tema oscuro, todos los drivers del mismo proveedor). Menos frecuente; reconócela, no la busques.

## Ya lo usas todos los días

- `document.createElement('canvas')` — le pides por nombre, el navegador decide la clase concreta.
- Los drivers de base de datos: `createConnection(url)` devuelve el conector de Postgres o MySQL según el esquema de la URL.
- Los transportes de un logger (consola, fichero, servicio externo) elegidos por configuración.
- Cualquier sistema de **plugins**: registrar un formato nuevo = añadir una entrada al mapa de la fábrica, sin tocar el núcleo. El registro de widgets de este mismo sitio funciona así.

## Cuándo NO usarlo

<aside class="callout callout-aviso">
<p class="callout-titulo">Aviso</p>

Una fábrica que construye **una sola clase** que nunca cambia es ceremonia pura — `new Usuario(nombre)` no necesita `UsuarioFactory.getInstance().create(nombre)`. Los patrones creacionales se ganan el sitio cuando hay una **decisión** que centralizar (varias implementaciones, elección por datos/config) o una dependencia que invertir para poder testear. Sin decisión, el `new` directo es la mejor fábrica.
</aside>

Con Factory cierras el ciclo creacional que abrió [Singleton](/temas/patrones-de-diseno/singleton/) — uno controla *cuántas* instancias hay; el otro, *cuáles*. Y si la fábrica decide con datos del negocio qué estrategia devolver, acabas de conectar los tres patrones que más usarás.

<div data-widget="mini-quiz" data-count="3"></div>
