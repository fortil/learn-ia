# learn-ia

<p align="center">
  <a href="https://github.com/fortil/learn-ia"><img src="https://img.shields.io/badge/github-fortil%2Flearn--ia-181717?logo=github" alt="github.com/fortil/learn-ia"></a>
  <a href="https://learn-ia.williampenagos.com/"><img src="https://img.shields.io/badge/sitio-learn--ia.williampenagos.com-blue?logo=googlechrome" alt="sitio en vivo"></a>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite" alt="Vite">
</p>

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

**Corrección (3 de octubre de 2026).** Lo de arriba sobre el "drift" estaba
mal: la diferencia entre producción y el código fuente son 10 cadenas de
texto, no dependencias. La build del 9 de septiembre dice "Madrid" donde el
fuente dice "Bogotá" (los ejemplos se corrigieron a Colombia después de esa
build, en `i18n/es/mapa.ts` y `i18n/en/mapa.ts`; el país quedó mal puesto
hasta el 3 de octubre). Un redeploy desde un tag es seguro y además publica
esa corrección.

## Despliegue real (paso a paso)

El sitio se sirve desde el bucket `ia-learn` de Aliyun OSS, región
`ap-southeast-1`, tras el DNS de `learn-ia.williampenagos.com`. La subida se
hace a mano desde la consola de OSS; este repo es la fuente de verdad y cada
deploy sale de un tag.

1. **Backup de producción** antes de tocar nada: descargar `index.html`, los
   archivos de `assets/` y un `SHA256SUMS` a
   `~/Develop/backups/learn-ia-prod-<fecha>/`. Es la vuelta atrás.
2. **Static Pages (una sola vez, consola de OSS):** bucket `ia-learn` →
   Data Management → Static Pages. Default Homepage: `index.html`. Subfolder
   Homepage: desactivado. Default 404 Page: `index.html`. Error Page Status
   Code: `200`. Sin esto, las rutas directas (`/mapa`, `/fomo`) devuelven un
   XML de error de OSS. Configurarlo primero y comprobar con la build actual
   que `/mitos` pasa de 404 a 200 antes de subir código nuevo.
3. **Build:** desde un tag nuevo (p. ej. `v1.1.0`), Node 22.16:

   ```bash
   cd app && npm ci && npm run build
   node scripts/check-fomo.mjs          # presupuestos y paridad i18n
   node scripts/check-fomo.mjs --media  # solo cuando haya mp4 publicados
   node scripts/oss-sim.mjs dist        # en otra pestaña; probar rutas abajo
   ```

   Contra el oss-sim (puerto 4174): `/`, `/mapa`, `/entrenamiento-vs-inferencia`,
   `/ejemplos`, `/mitos`, `/quiz`, `/fomo`, `/fomo/` y `/fomo?lang=en` deben
   responder 200 `text/html`.
4. **Subida (consola de OSS):** primero las carpetas `assets/` y `media/`;
   `index.html` al final, con `Cache-Control: no-cache`. No se borra el
   JavaScript viejo: sin cabeceras de caché, algún navegador puede conservar
   el `index.html` anterior un par de días y aún referenciarlo.
5. **Verificación en vivo:**

   ```bash
   H=https://learn-ia.williampenagos.com
   for p in / /mapa /mitos /quiz /fomo /fomo/ "/fomo?lang=en"; do
     curl -sS -o /dev/null -w "$p %{http_code} %{content_type}\n" "$H$p"
   done
   curl -sS -o /dev/null -w "%{http_code} %{content_type}\n" \
     -H 'Range: bytes=0-1023' "$H/media/fomo/fomo-4.v1.mp4"   # 206 video/mp4
   ```

   Mirar el content-type: con Static Pages, un archivo que falte responde
   `200 text/html` en vez de 404.
6. **Vuelta atrás:** subir de nuevo el `index.html` del backup. Para deshacer
   el enrutado, vaciar el campo Default 404 Page.

Los mp4 de `/fomo` no entran en git (`.gitignore`); el bucket y el disco
local son las únicas copias. `app/public/media/fomo/media.manifest.json`
deja nombre, bytes y sha256 de cada archivo publicado para que quede
trazado. El certificado TLS del dominio vence el 2026-12-08.

## Licencia

MIT. Ver [LICENSE](LICENSE).
