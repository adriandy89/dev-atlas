---
title: Autenticación y autorización
description: Quién eres y qué puedes hacer — los dos controles que protegen tu aplicación, y los errores que los saltan por completo.
category: seguridad
level: fundamentos
tags: [autenticacion, autorizacion, sesiones, jwt, owasp]
updated: 2026-07-22
order: 1
---

Son las dos preguntas de seguridad que tu aplicación responde en cada petición, y confundirlas es el origen de una familia entera de vulnerabilidades:

- **Autenticación (authn)** — *¿quién eres?* Verificar identidad: contraseña, passkey, OAuth, 2FA.
- **Autorización (authz)** — *¿tienes permiso para esto?* Verificar acceso: roles, propiedad del recurso, políticas.

Los códigos HTTP lo dicen con precisión: **401 Unauthorized** = "no sé quién eres" (fallo de autenticación); **403 Forbidden** = "sé quién eres, y no puedes" (fallo de autorización).

## El flujo completo de una petición

<div class="w-diagram">
<svg viewBox="0 0 460 150" role="img" aria-label="Flujo de una petición: primero autenticación, después autorización, y solo entonces el recurso.">
<defs><marker id="au-arw" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" class="w-edge-arrow"></path></marker></defs>
<rect class="w-node" x="10" y="42" width="88" height="46" rx="9"></rect><text class="w-node-label" x="54" y="69" text-anchor="middle">petición</text>
<rect class="w-node-accent" x="128" y="42" width="98" height="46" rx="9"></rect><text class="w-node-label" x="177" y="62" text-anchor="middle">¿quién?</text><text class="w-node-sub" x="177" y="80" text-anchor="middle">authn</text>
<rect class="w-node-accent" x="256" y="42" width="98" height="46" rx="9"></rect><text class="w-node-label" x="305" y="62" text-anchor="middle">¿puede?</text><text class="w-node-sub" x="305" y="80" text-anchor="middle">authz</text>
<rect class="w-node" x="384" y="42" width="68" height="46" rx="9"></rect><text class="w-node-label" x="418" y="69" text-anchor="middle">recurso</text>
<line class="w-edge" x1="98" y1="65" x2="124" y2="65" marker-end="url(#au-arw)"></line>
<line class="w-edge" x1="226" y1="65" x2="252" y2="65" marker-end="url(#au-arw)"></line>
<line class="w-edge" x1="354" y1="65" x2="380" y2="65" marker-end="url(#au-arw)"></line>
<text class="w-node-sub" x="177" y="122" text-anchor="middle">falla → 401</text>
<text class="w-node-sub" x="305" y="122" text-anchor="middle">falla → 403</text>
</svg>
<p class="w-diagram-cap">Dos puertas distintas, en orden. La segunda se comprueba en cada recurso, no una vez por sesión.</p>
</div>

## Contraseñas: la única forma correcta de guardarlas

Nunca en claro, nunca cifradas (lo cifrado se descifra), nunca con un hash rápido (MD5, SHA-256 a secas — una GPU prueba miles de millones por segundo). Lo correcto: un **hash lento con salt** — bcrypt, scrypt o Argon2.

```ts
import bcrypt from 'bcrypt';

// Registro: el salt va incluido en el hash resultante
const hash = await bcrypt.hash(password, 12); // 12 = factor de coste

// Login: comparación en tiempo constante
const valida = await bcrypt.compare(passwordIntroducida, hash);
```

- El **salt** (aleatorio, por usuario) hace inútiles las tablas precalculadas: dos usuarios con la misma contraseña tienen hashes distintos.
- El **factor de coste** hace el hash deliberadamente caro (~100 ms): imperceptible en un login, demoledor para quien intenta millones.

## Mantener la sesión: cookies vs. tokens

HTTP no tiene memoria: tras el login, cada petición debe demostrar quién eres. Dos estrategias dominan:

| | Sesión en servidor (cookie) | Token autocontenido (JWT) |
| --- | --- | --- |
| El servidor guarda | La sesión (memoria/Redis) | Nada: el token lleva los datos firmados |
| Revocar al instante | ✅ Borras la sesión | ⚠️ Difícil: el token vale hasta expirar |
| Varios servicios | Necesitan compartir el almacén | ✅ Cada uno verifica la firma |
| Riesgo típico | Fijación/robo de cookie | Guardarlo en `localStorage` (XSS lo lee) |

Para una aplicación web clásica, la cookie de sesión `HttpOnly; Secure; SameSite` sigue siendo la opción más segura y simple. Los JWT brillan **entre servicios**; usados como sesión de navegador, con expiración corta y *refresh token* — y jamás en `localStorage`.

<aside class="callout callout-aviso">
<p class="callout-titulo">Aviso</p>

Un JWT está **firmado, no cifrado**: cualquiera puede leer su contenido (es base64). La firma garantiza que no se ha modificado — no que sea secreto. No metas datos sensibles dentro.
</aside>

## El fallo de autorización número 1: IDOR

*Broken Access Control* encabeza el OWASP Top 10, y su forma más común es dolorosamente simple. Un usuario autenticado pide:

```
GET /api/facturas/1041   ← su factura
GET /api/facturas/1042   ← ...la de otro cliente. ¿Y el servidor la devuelve?
```

Eso es un **IDOR** (Insecure Direct Object Reference): la aplicación comprobó *quién eres* pero no *si ese recurso es tuyo*. La defensa es incluir la propiedad en cada consulta, en el servidor:

```ts
// ❌ Autenticado ≠ autorizado
const factura = await db.factura.findUnique({ where: { id } });

// ✅ La consulta misma exige la propiedad
const factura = await db.factura.findFirst({
  where: { id, clienteId: usuarioActual.id },
});
if (!factura) return res.sendStatus(404); // ni confirmes que existe
```

Reglas que evitan la familia entera de fallos:

- **Autoriza en el servidor, en cada petición.** Ocultar el botón en el frontend no es autorización — la API sigue expuesta a quien escriba la URL.
- **Denegar por defecto**: sin permiso explícito, la respuesta es no.
- **Mínimo privilegio**: cada rol (y cada servicio) con lo justo para operar.

## Lo que nunca escribes tú mismo

La criptografía y los flujos de identidad son el territorio con los errores más caros y menos visibles. Usa librerías y estándares probados — bcrypt/Argon2, OAuth 2.0/OpenID Connect, passkeys/WebAuthn — y reserva tu ingenio para tu dominio. En seguridad, la originalidad es un antipatrón.

<div data-widget="mini-quiz" data-count="3"></div>
