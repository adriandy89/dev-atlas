---
title: Observer
description: El patrón de suscripción que desacopla emisores de receptores — la base de los eventos, el data binding y la reactividad.
category: patrones-de-diseno
level: intermedio
tags: [comportamiento, eventos, reactividad]
updated: 2026-07-21
order: 2
---

Observer es un patrón de **comportamiento**: un objeto (el *sujeto*) mantiene una lista de *observadores* y les notifica automáticamente cuando su estado cambia. El sujeto no sabe quiénes son ni qué hacen — solo que implementan "recibir la notificación".

## El problema que resuelve

Sin Observer, el objeto que cambia debe conocer a todos los interesados:

```ts
// Acoplado: Pedido conoce a todos sus interesados
class Pedido {
  confirmar() {
    this.estado = 'confirmado';
    emailService.enviarConfirmacion(this);
    inventario.reservar(this);
    analitica.registrar('pedido_confirmado');
  }
}
```

Cada nuevo interesado obliga a tocar `Pedido`. Con Observer, la dependencia se invierte: los interesados **se suscriben**.

## Implementación mínima

```ts
type Listener<T> = (evento: T) => void;

class Emisor<T> {
  private listeners = new Set<Listener<T>>();

  suscribir(fn: Listener<T>): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn); // función de desuscripción
  }

  emitir(evento: T) {
    for (const fn of this.listeners) fn(evento);
  }
}

const pedidos = new Emisor<{ id: string }>();
const off = pedidos.suscribir((p) => console.log('reservar stock', p.id));
pedidos.emitir({ id: 'A-42' });
off(); // el observador se retira cuando ya no le interesa
```

## Dónde lo usas a diario

- **El DOM**: `addEventListener` es Observer literal.
- **Node.js**: `EventEmitter`.
- **Reactividad de frameworks**: las *signals* de Solid/Angular/Svelte, los `ref` de Vue o las stores de Redux son sujetos observables con distintos niveles de azúcar.
- **Sistemas de eventos de dominio**: "cuando se confirme un pedido, que quien quiera reaccione".

## Los costes que hay que vigilar

- **Fugas de memoria**: un observador que nunca se desuscribe mantiene vivo lo que referencia. Guarda siempre la función de desuscripción (o usa `AbortSignal` en el DOM).
- **Flujo difícil de seguir**: con muchos observadores, responder "¿qué pasa cuando cambia X?" exige buscar todas las suscripciones. Nombra los eventos con cuidado y centraliza dónde se suscriben.
- **Orden y errores**: ¿qué pasa si un observador lanza una excepción? Decide si el emisor la traga, la registra o corta la cadena — y documéntalo.

## Observer vs. Pub/Sub

Son primos: en Observer los suscriptores conocen al sujeto (`boton.addEventListener`); en **Pub/Sub** hay un intermediario (bus o broker) y emisor y receptor no se conocen en absoluto. El desacoplamiento extra de Pub/Sub es el que permite escalar a colas de mensajes entre servicios.

Contrasta este patrón con [Singleton](/temas/patrones-de-diseno/singleton/): uno gestiona *quién existe*, el otro *quién se entera*.
