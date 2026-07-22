---
title: Scrum y Kanban, sin liturgia
description: Qué problema resuelve cada marco ágil, cómo funcionan de verdad y cómo elegir (o combinar) según tu equipo.
category: metodologias
level: fundamentos
tags: [agile, scrum, kanban, wip]
updated: 2026-07-22
order: 1
---

El manifiesto ágil (2001) es una reacción a un mundo donde el software se planificaba entero por adelantado y se entregaba meses después — para descubrir entonces que el plan estaba equivocado. La alternativa: **ciclos cortos con feedback real**. Scrum y Kanban son las dos formas más extendidas de organizarlo; entender qué optimiza cada una te permite elegir con criterio en lugar de por inercia.

## Scrum: ritmo fijo, alcance variable

Scrum organiza el trabajo en **sprints**: iteraciones de duración fija (1–4 semanas) con un objetivo, al final de las cuales existe un **incremento funcionando**. El ciclo completo:

<div class="w-diagram">
<svg viewBox="0 0 460 220" role="img" aria-label="Ciclo de un sprint: del backlog de producto a la planificación, el sprint con daily, y la revisión y retrospectiva que realimentan el backlog.">
<defs><marker id="sc-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="10" y="80" width="104" height="52" rx="10"></rect><text class="w-node-label" x="62" y="102" text-anchor="middle">Backlog</text><text class="w-node-sub" x="62" y="120" text-anchor="middle">priorizado (PO)</text>
<rect class="w-node" x="150" y="80" width="104" height="52" rx="10"></rect><text class="w-node-label" x="202" y="102" text-anchor="middle">Planning</text><text class="w-node-sub" x="202" y="120" text-anchor="middle">objetivo del sprint</text>
<rect class="w-node-accent" x="290" y="80" width="104" height="52" rx="10"></rect><text class="w-node-label" x="342" y="102" text-anchor="middle">Sprint</text><text class="w-node-sub" x="342" y="120" text-anchor="middle">daily de 15 min</text>
<rect class="w-node" x="290" y="164" width="150" height="44" rx="10"></rect><text class="w-node-label" x="365" y="184" text-anchor="middle">Review + Retro</text><text class="w-node-sub" x="365" y="200" text-anchor="middle">producto · proceso</text>
<rect class="w-node" x="290" y="10" width="150" height="40" rx="10"></rect><text class="w-node-label" x="365" y="35" text-anchor="middle">Incremento ✓</text>
<line class="w-edge" x1="114" y1="106" x2="146" y2="106" marker-end="url(#sc-arw)"></line>
<line class="w-edge" x1="254" y1="106" x2="286" y2="106" marker-end="url(#sc-arw)"></line>
<line class="w-edge" x1="342" y1="80" x2="352" y2="54" marker-end="url(#sc-arw)"></line>
<line class="w-edge" x1="342" y1="132" x2="352" y2="160" marker-end="url(#sc-arw)"></line>
<path class="w-edge" d="M 288 186 C 120 186, 62 170, 62 136" fill="none" marker-end="url(#sc-arw)"></path>
</svg>
<p class="w-diagram-cap">La retro alimenta el siguiente sprint: el equipo no solo construye producto — ajusta su propio proceso cada ciclo.</p>
</div>

Las piezas mínimas, sin adornos:

- **Product Owner**: ordena el backlog por valor. Decide *qué* y *en qué orden*; no *cómo* ni *cuánto cabe*.
- **Equipo de desarrollo**: decide cuánto entra en el sprint y cómo construirlo.
- **Scrum Master**: quita obstáculos y protege el proceso (no es "el jefe del equipo").
- **Daily** (15 min): sincronización entre pares — no un reporte al jefe.
- **Review**: se enseña el incremento a los interesados y se recoge feedback del *producto*.
- **Retrospectiva**: el equipo examina su *proceso* y elige una mejora concreta para el siguiente sprint.

El contrato clave: **durante el sprint, el alcance no cambia**. La urgencia de hoy espera al siguiente (que empieza en días, no en meses).

## Kanban: flujo continuo y WIP limitado

Kanban no tiene sprints ni roles: **visualiza el flujo y limita el trabajo en curso (WIP)**. El tablero es el método:

```
| Por hacer (∞) | En curso (máx 3) | En revisión (máx 2) | Hecho |
```

Ese numerito — el **límite WIP** — es todo el secreto. Si "En curso" está lleno, no puedes empezar nada nuevo: o ayudas a terminar lo que hay, o esperas. Suena restrictivo; es exactamente lo contrario de lo que hacen los equipos que naufragan (quince cosas "en curso", ninguna terminando).

- **Empezar menos, terminar más**: el tiempo de entrega (*lead time*) baja cuando el WIP baja — es la ley de Little, no una opinión.
- **Los cuellos de botella se hacen visibles**: si "En revisión" siempre está al tope, ya sabes dónde invertir.
- **El cambio urgente entra hoy**: no hay sprint que proteger; entra en cuanto hay hueco.

## ¿Cuál elegir?

| | Scrum | Kanban |
| --- | --- | --- |
| Cadencia | Sprints fijos | Flujo continuo |
| Compromiso | Objetivo por sprint | Límite de WIP |
| ¿Cambios a mitad? | Esperan al siguiente sprint | Entran cuando hay hueco |
| Métrica natural | Velocidad por sprint | Lead time / throughput |
| Brilla en | Producto con roadmap, equipo estable | Soporte, plataforma, flujo interrumpible |

En la práctica: **producto** con prioridades que pueden esperar dos semanas → Scrum; **operaciones/soporte** donde lo urgente no espera → Kanban; y muchísimos equipos maduros en un híbrido (cadencia de retros de Scrum + flujo y WIP de Kanban, a veces llamado *Scrumban*).

<aside class="callout callout-truco">
<p class="callout-titulo">Truco</p>

Si solo puedes adoptar **una** práctica de todo esto, que sea la **retrospectiva regular con acciones concretas**. Un equipo que examina y ajusta su proceso cada dos semanas acaba convergiendo hacia lo que necesita — tenga el nombre que tenga.
</aside>

## Cómo reconocer el cargo-cult

Las ceremonias sin sus principios producen "agile" de pega — y es epidémico:

- **Scrum zombi**: hay daily, sprints y Jira, pero el "sprint" lo decide un jefe, la daily es un reporte de estado y la retro no cambia nada. Eso es cascada con reuniones extra.
- **La velocidad como látigo**: la velocidad sirve al equipo para prever cuánto cabe; usada para comparar equipos o exigir "subirla un 20%", solo infla estimaciones.
- **Tablero Kanban sin límites WIP**: es una lista de tareas bonita, no Kanban. Sin límite no hay flujo que gestionar.
- **Cien por cien de ocupación**: optimizar que nadie esté "parado" maximiza el WIP y hunde la entrega. Se optimiza el flujo de trabajo terminado, no la ocupación de las personas.

La prueba de fuego de cualquier proceso es la misma que la de una [arquitectura](/temas/arquitectura/arquitectura-en-capas/): ¿te permite **entregar valor y corregir el rumbo más rápido**? Si la respuesta lleva meses siendo no, cambia el proceso — con permiso del manifiesto o sin él.

<div data-widget="mini-quiz" data-count="3"></div>
