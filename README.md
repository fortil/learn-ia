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

**Verificación de reproducibilidad (23 de septiembre de 2026).** Un clon
limpio de este repo, con `npm ci && npm run build` en Node 22.16, produce un
`dist/` cuyo JS y CSS coinciden byte a byte (mismo SHA-256) con la build local
del 20 de septiembre. No coincide con la build del 9 de septiembre que está
en producción: ese JS (`index-DAUpj8m_.js`) no aparece en ningún build hecho
desde este código fuente. La causa concreta se desconoce; el código en
`app/src` y `app/public` no cambió después del 9 de septiembre, así que el
origen más probable es un drift de dependencias o de entorno de build entre
esa fecha y el 20 de septiembre. A partir de este commit, cada deploy debe
salir de un tag de este repo para que este tipo de discrepancia deje de
poder pasar sin dejar rastro.

## Licencia

MIT. Ver [LICENSE](LICENSE).
