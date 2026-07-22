---
title: Transacciones y ACID
description: Todo o nada — cómo las transacciones protegen tus datos de fallos a mitad de camino y de dos usuarios tocando lo mismo a la vez.
category: bases-de-datos
level: fundamentos
tags: [sql, transacciones, acid, concurrencia]
updated: 2026-07-22
order: 2
---

Transfiere 100 € de la cuenta A a la B: un `UPDATE` que resta y otro que suma. Ahora imagina que el servidor se cae **entre los dos**. Sin protección, acabas de hacer desaparecer 100 € — el dinero salió de A y nunca llegó a B. La **transacción** existe para que ese estado intermedio sea imposible.

## Todo o nada

Una transacción agrupa operaciones en una **unidad atómica**: o se aplican todas, o ninguna.

```sql
BEGIN;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 'A';
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 'B';
COMMIT;
```

<div class="w-diagram">
<svg viewBox="0 0 460 150" role="img" aria-label="Dos operaciones dentro de una caja atómica: si todo va bien, commit las publica juntas; si algo falla, rollback deja todo como estaba.">
<defs><marker id="tx-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node-accent" x="80" y="14" width="204" height="122" rx="12"></rect>
<text class="w-node-sub" x="182" y="38" text-anchor="middle">transacción</text>
<rect class="w-node" x="100" y="50" width="164" height="32" rx="8"></rect><text class="w-node-sub" x="182" y="71" text-anchor="middle">A: saldo − 100</text>
<rect class="w-node" x="100" y="92" width="164" height="32" rx="8"></rect><text class="w-node-sub" x="182" y="113" text-anchor="middle">B: saldo + 100</text>
<line class="w-edge" x1="284" y1="55" x2="360" y2="55" marker-end="url(#tx-arw)"></line>
<text class="w-node-sub" x="370" y="59">COMMIT ✓</text>
<line class="w-edge" x1="284" y1="108" x2="360" y2="108" marker-end="url(#tx-arw)"></line>
<text class="w-node-sub" x="370" y="112">ROLLBACK ↺</text>
</svg>
<p class="w-diagram-cap">Desde fuera solo existen dos estados posibles: el de antes y el de después. El intermedio es invisible e inalcanzable.</p>
</div>

En el código de aplicación, el patrón es siempre el mismo — y el `ROLLBACK` en el `catch` no es opcional:

```ts
const cliente = await pool.connect();
try {
  await cliente.query('BEGIN');
  await cliente.query('UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2', [100, 'A']);
  await cliente.query('UPDATE cuentas SET saldo = saldo + $1 WHERE id = $2', [100, 'B']);
  await cliente.query('COMMIT');
} catch (e) {
  await cliente.query('ROLLBACK'); // deshace TODO lo hecho desde BEGIN
  throw e;
} finally {
  cliente.release();
}
```

## ACID, garantía a garantía

- **Atomicidad** — todo o nada. Lo que acabas de ver: el fallo a mitad de camino deshace lo hecho.
- **Consistencia** — la transacción lleva la base de datos de un estado válido a otro estado válido: las restricciones (`NOT NULL`, claves foráneas, `CHECK saldo >= 0`) se cumplen al confirmar, o la transacción no confirma.
- **Aislamiento** — las transacciones concurrentes no se ven los platos a medio cocinar. Sin esto, un lector podría ver el dinero "desaparecido" durante los microsegundos entre los dos `UPDATE`.
- **Durabilidad** — tras el `COMMIT`, el dato sobrevive a un corte de luz: está en disco (en el *write-ahead log*), no solo en memoria.

## El aislamiento tiene niveles (y por eso hay bugs)

El aislamiento perfecto (ejecutar como si las transacciones fueran una cola, en serie) es carísimo, así que las bases de datos ofrecen **niveles** con distintos compromisos:

| Nivel | Qué permite colarse | Uso |
| --- | --- | --- |
| Read uncommitted | Leer datos sin confirmar (*dirty reads*) | Prácticamente nunca |
| **Read committed** | Dos lecturas iguales pueden devolver distinto | **El defecto en Postgres** |
| Repeatable read | Fija la foto de los datos leídos | Informes consistentes |
| Serializable | Nada: equivale a ejecutar en serie | Cuando la corrección manda |

La trampa clásica vive en el nivel por defecto — el **check-then-act**:

```ts
// ❌ Dos peticiones concurrentes pasan el if a la vez → doble reserva
const plazas = await query('SELECT libres FROM eventos WHERE id = $1', [id]);
if (plazas > 0) await query('UPDATE eventos SET libres = libres - 1 WHERE id = $1', [id]);

// ✅ La condición viaja DENTRO de la operación atómica
const r = await query(
  'UPDATE eventos SET libres = libres - 1 WHERE id = $1 AND libres > 0',
  [id],
);
if (r.rowCount === 0) throw new Error('sin plazas');
```

Es una *race condition* de manual — la misma familia de fallos que en concurrencia general, solo que aquí la solución te la regala la base de datos: **haz que la comprobación y la acción sean una sola sentencia atómica**.

<aside class="callout callout-truco">
<p class="callout-titulo">Truco</p>

Transacciones **cortas**. Una transacción abierta retiene bloqueos y versiones antiguas: si dentro haces una llamada HTTP o esperas entrada del usuario, todos los demás esperan contigo. Regla práctica: dentro de `BEGIN…COMMIT` solo entra trabajo de base de datos — lo lento se hace antes o después.
</aside>

## Dónde encaja en el mapa

Las transacciones protegen la **corrección** de tus escrituras igual que los [índices](/temas/bases-de-datos/indices-de-base-de-datos/) protegen la **velocidad** de tus lecturas — son las dos herramientas que justifican media categoría. Y la disciplina de reintentar operaciones falladas sin miedo depende de que sean atómicas e **idempotentes**: una transferencia aplicada a medias no se puede reintentar; una atómica, sí.

<div data-widget="mini-quiz" data-count="3"></div>
