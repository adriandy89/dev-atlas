---
title: CI/CD — integración y entrega continuas
description: El pipeline que convierte cada commit en software desplegable, qué automatizar en cada etapa y las prácticas que lo hacen sostenible.
category: devops
level: fundamentos
tags: [ci, cd, pipeline, automatizacion]
updated: 2026-07-22
order: 1
---

Antes de la integración continua, los equipos integraban su trabajo cada semanas o meses — y esa integración era un infierno de conflictos apodado *merge hell*. CI/CD ataca el problema con una idea contraintuitiva: **si algo duele, hazlo más a menudo**. Integra cada día y el conflicto es pequeño; despliega cada día y el riesgo de cada despliegue se desploma.

## El pipeline

Cada push dispara una cadena automática de etapas. Si una falla, la cadena se corta y nadie hereda el problema:

<div class="w-diagram">
<svg viewBox="0 0 460 120" role="img" aria-label="Pipeline de cinco etapas: commit, build, tests, staging y producción, conectadas en secuencia.">
<defs><marker id="ci-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="8" y="38" width="72" height="44" rx="9"></rect><text class="w-node-label" x="44" y="64" text-anchor="middle">commit</text>
<rect class="w-node" x="102" y="38" width="72" height="44" rx="9"></rect><text class="w-node-label" x="138" y="64" text-anchor="middle">build</text>
<rect class="w-node" x="196" y="38" width="72" height="44" rx="9"></rect><text class="w-node-label" x="232" y="64" text-anchor="middle">tests</text>
<rect class="w-node" x="290" y="38" width="72" height="44" rx="9"></rect><text class="w-node-label" x="326" y="64" text-anchor="middle">staging</text>
<rect class="w-node-accent" x="384" y="38" width="68" height="44" rx="9"></rect><text class="w-node-label" x="418" y="64" text-anchor="middle">prod</text>
<line class="w-edge" x1="80" y1="60" x2="98" y2="60" marker-end="url(#ci-arw)"></line>
<line class="w-edge" x1="174" y1="60" x2="192" y2="60" marker-end="url(#ci-arw)"></line>
<line class="w-edge" x1="268" y1="60" x2="286" y2="60" marker-end="url(#ci-arw)"></line>
<line class="w-edge" x1="362" y1="60" x2="380" y2="60" marker-end="url(#ci-arw)"></line>
<text class="w-node-sub" x="232" y="106" text-anchor="middle">cada etapa es una puerta: si falla, el pipeline se detiene</text>
</svg>
<p class="w-diagram-cap">Del commit a producción sin manos humanas — o con una sola aprobación, según cuánto CD practiques.</p>
</div>

- **Build**: compila, resuelve dependencias, empaqueta (a menudo, una imagen de contenedor). Falla aquí = ni siquiera compila.
- **Tests**: la [pirámide entera](/temas/testing/piramide-de-testing/) — unitarios siempre; integración y E2E según el presupuesto de tiempo. También linters y análisis estático.
- **Staging**: despliegue real en un entorno clon de producción. Aquí cazas lo que solo aparece desplegado: variables de entorno, migraciones, permisos.
- **Producción**: el despliegue final — automático o tras un botón.

## CI, delivery y deployment no son lo mismo

| Práctica | Qué automatiza | La decisión de desplegar |
| --- | --- | --- |
| **Integración continua (CI)** | Build + tests en cada push a la rama principal | — |
| **Entrega continua (delivery)** | Todo hasta dejar el artefacto **listo** para producción | La toma una persona (un clic) |
| **Despliegue continuo (deployment)** | Todo, incluida producción | La toma el pipeline: verde = desplegado |

El salto de uno a otro no es de herramientas, es de **confianza en tus tests**. Si un pipeline verde no te da tranquilidad para desplegar un viernes, el problema no es el viernes.

## Un pipeline real (GitHub Actions)

```yaml
name: ci
on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci          # instalación exacta desde el lockfile
      - run: npm run lint    # estilo y errores estáticos
      - run: npm test        # la suite completa
      - run: npm run build   # ¿el artefacto se genera?
```

Nota los detalles: `npm ci` (no `install`) garantiza las versiones del lockfile, y el pipeline corre **también en cada pull request** — el error se descubre antes del merge, no después.

## Las prácticas que lo hacen funcionar

- **La rama principal siempre está desplegable.** Es el contrato del equipo entero; todo lo demás deriva de aquí.
- **Pipeline rápido (&lt;10 min).** Más lento y la gente hace push sin esperar el resultado — y el semáforo deja de funcionar como semáforo.
- **Arreglar el build roto es la prioridad del equipo.** Un main rojo bloquea a todos; se arregla o se revierte en minutos, sin drama con el revert.
- **Ramas cortas.** Una rama de tres semanas es integración diferida — exactamente lo que CI vino a eliminar.
- **Feature flags** para separar *desplegar* (mover código) de *publicar* (activarlo a usuarios): el código llega a producción apagado y se enciende gradualmente.

<aside class="callout callout-aviso">
<p class="callout-titulo">Aviso</p>

Un pipeline con tests pobres es **teatro de CI**: automatiza la entrega de bugs a producción con gran eficiencia. La calidad del pipeline es exactamente la calidad de su suite de tests — empieza por ahí.
</aside>

## Cuando algo sale mal en producción

El objetivo con el que medirse no es "no fallar nunca" (imposible) sino **recuperarse en minutos**: detectar rápido (monitorización y alertas), y volver atrás barato — *rollback* a la versión anterior o apagar el feature flag. Los equipos de élite no despliegan menos por miedo; despliegan más pequeño y más a menudo, porque un cambio de 50 líneas se diagnostica y se revierte solo.

<div data-widget="mini-quiz" data-count="3"></div>
