---
title: Pilas y colas
description: LIFO y FIFO — las dos disciplinas de acceso que estructuran desde el call stack hasta las colas de mensajes.
category: estructuras-de-datos
level: fundamentos
tags: [pilas, colas, lifo, fifo]
updated: 2026-07-21
order: 1
---

Pilas y colas no son estructuras complejas: son **restricciones deliberadas** sobre una lista. Justo esa restricción es la que las hace útiles: el código que las usa se vuelve predecible y fácil de razonar.

## Pila (stack): LIFO

*Last In, First Out* — el último en entrar es el primero en salir, como una pila de platos. Operaciones: `push` (apilar), `pop` (desapilar) y `peek` (mirar la cima), todas O(1).

```ts
const pila: number[] = [];
pila.push(1);
pila.push(2);
pila.pop(); // 2 — el último que entró
```

Pruébalo: solo puedes tocar la cima.

<div data-widget="stack"></div>

### Dónde aparece

- **El call stack**: cada llamada a función se apila; al retornar, se desapila. Un desbordamiento de pila es literalmente esta estructura llenándose.
- **Deshacer/rehacer** en cualquier editor.
- **Validar anidamientos**: paréntesis, etiquetas HTML, bloques — lo último que se abre es lo primero que debe cerrarse.
- **Recorridos en profundidad (DFS)** de árboles y grafos, tanto con recursión (pila implícita) como con pila explícita.

## Cola (queue): FIFO

*First In, First Out* — el primero en entrar es el primero en salir, como una fila. Operaciones: `enqueue` (encolar) y `dequeue` (desencolar).

En JavaScript, `Array.prototype.shift()` es O(n) porque desplaza todos los elementos; para colas grandes usa una implementación con dos pilas o una lista enlazada:

```ts
class Cola<T> {
  private entrada: T[] = [];
  private salida: T[] = [];

  enqueue(x: T) {
    this.entrada.push(x);
  }

  dequeue(): T | undefined {
    if (this.salida.length === 0) {
      while (this.entrada.length) this.salida.push(this.entrada.pop()!);
    }
    return this.salida.pop(); // O(1) amortizado
  }
}
```

Pruébalo: entra por el final, sale por el frente.

<div data-widget="queue"></div>

### Dónde aparece

- **Colas de tareas y mensajería** (RabbitMQ, SQS, BullMQ): procesar trabajo en orden de llegada.
- **El event loop** de JavaScript: la cola de macrotareas y microtareas.
- **Recorridos en anchura (BFS)**: visitar un grafo por niveles.

## Variantes que conviene conocer

- **Deque** (double-ended queue): inserta y extrae por ambos extremos en O(1).
- **Cola de prioridad**: sale primero el elemento más urgente, no el más antiguo; se implementa con un heap.
- **Buffer circular**: cola de tamaño fijo sobre un array, sin mover elementos — la base de los buffers de streaming.

<div data-widget="mini-quiz" data-count="3"></div>

La pregunta que decide cuál usar siempre es la misma: **¿en qué orden necesito recuperar lo que guardo?** Si la respuesta es "el más reciente", pila; "el más antiguo", cola; "el más importante", cola de prioridad.
