---
title: Arquitectura en capas
description: Cómo organizar una aplicación en capas con responsabilidades claras, y la regla de dependencia que lo sostiene todo.
category: arquitectura
level: fundamentos
tags: [capas, acoplamiento, diseno]
updated: 2026-07-22
order: 1
---

Antes de hablar de microservicios, eventos o hexágonos, hay que dominar la idea de la que descienden todas: **separar el código en capas con responsabilidades distintas**, donde cada capa solo conoce a la que tiene debajo. Es la arquitectura por defecto de la mayoría de aplicaciones — y hacerla bien te lleva más lejos de lo que parece.

## Las tres capas clásicas

1. **Presentación** — habla con el mundo exterior: controladores HTTP, CLI, la UI. Traduce peticiones a llamadas de la capa de dominio, y resultados a respuestas.
2. **Dominio (o lógica de negocio)** — las reglas de tu aplicación: qué es un pedido válido, cuándo se aplica un descuento, qué pasa al confirmar. **Aquí vive el valor.**
3. **Datos** — persiste y recupera: repositorios, SQL, llamadas a otras APIs.

<div class="w-diagram">
<svg viewBox="0 0 460 250" role="img" aria-label="Tres capas apiladas: presentación llama a dominio, dominio llama a datos. Las dependencias apuntan solo hacia abajo.">
<defs><marker id="cap-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="90" y="14" width="280" height="52" rx="11"></rect><text class="w-node-label" x="230" y="36" text-anchor="middle">Presentación</text><text class="w-node-sub" x="230" y="54" text-anchor="middle">HTTP · UI · CLI</text>
<rect class="w-node-accent" x="90" y="99" width="280" height="52" rx="11"></rect><text class="w-node-label" x="230" y="121" text-anchor="middle">Dominio</text><text class="w-node-sub" x="230" y="139" text-anchor="middle">reglas de negocio</text>
<rect class="w-node" x="90" y="184" width="280" height="52" rx="11"></rect><text class="w-node-label" x="230" y="206" text-anchor="middle">Datos</text><text class="w-node-sub" x="230" y="224" text-anchor="middle">repositorios · SQL · APIs externas</text>
<line class="w-edge" x1="230" y1="68" x2="230" y2="95" marker-end="url(#cap-arw)"></line>
<line class="w-edge" x1="230" y1="153" x2="230" y2="180" marker-end="url(#cap-arw)"></line>
</svg>
<p class="w-diagram-cap">Las flechas son dependencias, y solo apuntan hacia abajo. El dominio no sabe qué es HTTP ni qué base de datos hay debajo.</p>
</div>

## La regla de dependencia

Todo el valor de las capas está en una sola regla: **las dependencias apuntan en una única dirección**. La presentación conoce al dominio; el dominio conoce (una abstracción de) los datos; y nunca al revés.

```ts
// Presentación: traduce HTTP ↔ dominio. Ni una regla de negocio aquí.
app.post('/pedidos/:id/confirmar', async (req, res) => {
  const resultado = await confirmarPedido(req.params.id);
  res.status(resultado.ok ? 200 : 409).json(resultado);
});

// Dominio: reglas puras. Ni req/res, ni SQL — recibe el repositorio como dependencia.
async function confirmarPedido(id: string) {
  const pedido = await repoPedidos.buscar(id);
  if (!pedido) return { ok: false, error: 'no existe' };
  if (pedido.lineas.length === 0) return { ok: false, error: 'pedido vacío' };
  pedido.estado = 'confirmado';
  await repoPedidos.guardar(pedido);
  return { ok: true };
}

// Datos: implementa la interfaz que el dominio define.
const repoPedidos = {
  buscar: (id: string) => db.query('SELECT ... WHERE id = $1', [id]),
  guardar: (p: Pedido) => db.query('UPDATE ...'),
};
```

La prueba del algodón: **¿puedes testear `confirmarPedido` sin levantar un servidor ni una base de datos?** Si la respuesta es sí (pasándole un repositorio falso), tus capas están bien cortadas. Esa misma idea llevada al extremo — el dominio define interfaces y todo lo demás las implementa — es la arquitectura hexagonal (puertos y adaptadores).

<aside class="callout callout-idea">
<p class="callout-titulo">Idea</p>

La regla de dependencia es la misma que verás en la [inversión de dependencias de SOLID](/temas/buenas-practicas/principios-solid/): las capas de arriba dependen de **abstracciones**, no de detalles. Una arquitectura es, en el fondo, decidir quién puede conocer a quién.
</aside>

## Qué gana (y qué cuesta)

**Ganas:**

- **Testabilidad** — el dominio se prueba en milisegundos, sin infraestructura.
- **Cambios locales** — migrar de Postgres a otra base de datos toca una capa, no tres.
- **Onboarding** — "¿dónde va esto?" tiene respuesta: reglas → dominio; formato de respuesta → presentación; SQL → datos.

**Pagas:**

- **Indirección** — más ficheros y algún paso extra para features triviales.
- **Disciplina** — el compilador no impide un `SELECT` en un controlador; el equipo sí (revisión de código, linters de imports).

## Las trampas clásicas

- **El dominio anémico**: entidades que solo tienen getters/setters y toda la lógica desparramada por los controladores. Tienes tres carpetas, pero no tres capas.
- **Saltarse una capa** "solo por esta vez": un `SELECT` en el controlador hoy es la razón por la que no puedes testear ni migrar mañana.
- **Fugas de abstracción**: si el dominio devuelve entidades de tu ORM, la base de datos se ha colado en todas partes. Devuelve tipos propios.
- **Capas por decreto**: en un script de 200 líneas, tres capas son ceremonia. La arquitectura se gana su coste cuando el negocio tiene reglas de verdad.

## De aquí a dónde

Cuando el monolito en capas crece, las costuras naturales para dividirlo — por módulos o por servicios — son justamente los límites que las capas te obligaron a mantener limpios. Un monolito bien estratificado se parte bien; uno enredado, no. Esa decisión (y sus costes de red, despliegue y consistencia) es el siguiente tema de esta categoría.

<div data-widget="mini-quiz" data-count="3"></div>
