---
title: Diseña una caché LRU
description: Implementa una caché con capacidad fija que expulse el elemento menos usado recientemente, con get y put en O(1).
difficulty: dificil
category: estructuras-de-datos
tags: [hash, listas-enlazadas, diseno]
hints:
  - 'Necesitas dos cosas a la vez: buscar por clave en O(1) y mantener un orden de uso actualizable en O(1). Ninguna estructura sola da las dos.'
  - Una tabla hash da la búsqueda; una lista doblemente enlazada da "mover al frente" y "expulsar del final" en O(1).
  - En JavaScript, Map recuerda el orden de inserción — puedes apoyarte en eso para una versión mucho más corta.
updated: 2026-07-21
---

Diseña una estructura `CacheLRU` (*Least Recently Used*) con capacidad máxima fija:

- `get(clave)` → devuelve el valor o `-1` si no existe. **Cuenta como uso.**
- `put(clave, valor)` → inserta o actualiza. Si se supera la capacidad, **expulsa el elemento menos usado recientemente**.

Ambas operaciones deben ser **O(1)**.

## Ejemplo

```
const cache = new CacheLRU(2);
cache.put(1, 1);  // {1}
cache.put(2, 2);  // {1, 2}
cache.get(1);     // → 1, ahora 1 es el más reciente: {2, 1}
cache.put(3, 3);  // capacidad superada: expulsa 2 → {1, 3}
cache.get(2);     // → -1
```

Es el mecanismo real de cachés de página, pools de conexiones y memoization con límite de memoria.

<details class="solucion">
<summary>Ver solución</summary>

**Idea canónica**: tabla hash (clave → nodo) + lista doblemente enlazada que mantiene el orden de uso. Cada `get`/`put` mueve el nodo al frente; la expulsión quita el último. Todas las operaciones sobre la lista son O(1) porque el hash te da el nodo directamente.

En JavaScript, `Map` itera en orden de inserción, lo que permite una implementación compacta con la misma complejidad amortizada:

```ts
class CacheLRU<K, V> {
  private mapa = new Map<K, V>();

  constructor(private capacidad: number) {}

  get(clave: K): V | -1 {
    if (!this.mapa.has(clave)) return -1;
    const valor = this.mapa.get(clave)!;
    // Reinsertar = marcar como "más reciente"
    this.mapa.delete(clave);
    this.mapa.set(clave, valor);
    return valor;
  }

  put(clave: K, valor: V): void {
    if (this.mapa.has(clave)) this.mapa.delete(clave);
    this.mapa.set(clave, valor);
    if (this.mapa.size > this.capacidad) {
      // El primero en el orden de inserción es el menos reciente
      const masAntigua = this.mapa.keys().next().value!;
      this.mapa.delete(masAntigua);
    }
  }
}
```

**Por qué funciona**: el `Map` actúa como la lista enlazada (orden) y la tabla hash (acceso) a la vez. `delete` + `set` equivale a "mover al frente".

En una entrevista exigente pueden pedirte la versión explícita con lista doblemente enlazada (nodos con `prev`/`next` y dos centinelas `head`/`tail`): el razonamiento es idéntico, con el movimiento de punteros a mano. Merece la pena escribirla una vez para entender qué te está regalando `Map`.

**Complejidad**: O(1) en tiempo por operación, O(capacidad) en espacio.

</details>
