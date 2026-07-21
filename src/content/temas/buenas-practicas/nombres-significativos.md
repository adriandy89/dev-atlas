---
title: Nombres significativos
description: Reglas prácticas para nombrar variables, funciones y clases de forma que el código se explique solo.
category: buenas-practicas
level: fundamentos
tags: [clean-code, legibilidad, refactorizacion]
updated: 2026-07-21
order: 1
---

El código se escribe una vez y se lee decenas. Un buen nombre elimina la necesidad de un comentario, de abrir la función para ver qué hace, o de preguntar al autor. Nombrar bien no es cosmética: es la práctica con mejor relación esfuerzo/beneficio de todo el clean code.

## Las reglas que más rinden

### Que el nombre revele la intención

Si necesitas un comentario para explicar la variable, el nombre está mal elegido.

```ts
// Antes
const d = 86400; // segundos en un día
const list2 = list.filter((u) => u.a > 18);

// Después
const SEGUNDOS_POR_DIA = 86400;
const usuariosMayoresDeEdad = usuarios.filter((u) => u.edad >= 18);
```

### Evita la desinformación

Peor que un nombre vago es uno que miente: `lista` que es un `Set`, `getUsuario()` que además lo crea si no existe, `temporal` que lleva tres años en producción. Cuando el comportamiento cambie, **renombra en el momento**.

### La longitud proporcional al alcance

- Índice de un bucle de dos líneas: `i` es perfecto.
- Variable de módulo o campo de clase: nombre completo y específico.
- Función pública de una librería: el nombre es documentación — invierte en él.

### Distinciones que distingan algo

`datos` vs `datos2`, `info` vs `informacion`, `ProductoManager` vs `ProductoHandler`: pares que obligan al lector a abrir el código para saber cuál es cuál. Si dos cosas son distintas, el nombre debe decir **en qué**.

## Convenciones que dan gratis legibilidad

- **Funciones = verbos** (`calcularTotal`, `enviarFactura`); **clases y variables = sustantivos** (`Factura`, `totalPendiente`).
- **Booleanos como predicados**: `esValido`, `tienePermiso`, `puedeReintentar` — se leen naturales en un `if`.
- **Simetría en los pares**: `abrir/cerrar`, `crear/destruir`, `añadir/quitar`. Mezclar `begin/stop` descoloca.
- **Un término por concepto** en todo el proyecto: si al usuario lo llamas `cliente` en el dominio, no lo llames `user` en la mitad de los archivos.

## El olor que delata un mal diseño

Cuando no encuentras un buen nombre, muchas veces el problema no es vocabulario: **la función hace demasiadas cosas**. `procesarYValidarYGuardar()` no necesita un nombre mejor; necesita dividirse en tres. El nombre imposible es una señal de diseño, igual que la duplicación que analiza el [principio DRY](/temas/buenas-practicas/principio-dry/).

## Regla final

Optimiza para quien lee, no para quien escribe. Ahorrarte cuatro letras hoy (`usr`, `cfg`, `tmp`) se paga cada día durante la vida del proyecto.
