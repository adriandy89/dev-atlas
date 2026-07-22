/**
 * Tipos compartidos de los widgets interactivos de los artículos.
 *
 * Cada widget vive como `<div data-widget="NOMBRE">` dentro de `.prose`; el
 * cargador (`scripts/widgets/index.ts`) importa el módulo bajo demanda y llama
 * a su `mount(el)`. Los estilos de todos los widgets están en
 * `styles/widgets.css` (globales: los `<style>` scoped no alcanzan el DOM que
 * inyecta el markdown).
 */

export interface WidgetModule {
  /** Monta el widget dentro de su elemento contenedor. Debe ser idempotente. */
  mount(el: HTMLElement): void;
}

/** ¿El usuario prefiere menos movimiento? Los widgets saltan a su estado final. */
export function prefiereMenosMovimiento(): boolean {
  return (
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
