# learn-ia

Sitio interactivo en español que explica qué es la inferencia en IA a una
audiencia no técnica, con un mapa navegable paso a paso, comparación
entrenamiento vs. inferencia, ejemplos cotidianos, mitos comunes y un quiz.

Sitio en vivo: https://learn-ia.williampenagos.com/

## Stack

React + TypeScript + Vite, componentes shadcn/Radix, Tailwind CSS.

## Correr en local

```bash
cd app
npm ci
npm run dev
```

Build de producción:

```bash
cd app
npm run build
```

Genera `app/dist/`, que no está en este repo (ver "Despliegue" abajo).

## Despliegue

El sitio se sirve como contenido estático desde Aliyun OSS. Este repositorio
es la fuente de verdad: cualquier build que se despliegue debe salir de un
commit etiquetado aquí, no de un `dist/` local suelto.

Procedencia de las builds hasta la fecha:

- Build del 9 de septiembre de 2026: la que está desplegada en producción.
- Build local del 20 de septiembre de 2026: generada en este equipo, nunca
  desplegada.

## Licencia

MIT. Ver [LICENSE](LICENSE).
