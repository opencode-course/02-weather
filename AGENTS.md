# 02-weather

CLI de clima en TypeScript. App de consola con menú interactivo que consulta OpenMeteo y puede compilarse a un binario ejecutable.

## Comandos

Runtime es **Bun**, no Node:

- `bun install` — instalar dependencias
- `bun run start` — ejecutar la app
- `bun run dev` — ejecutar la app en modo watch
- `bun run build` — compilar el binario ejecutable `./weather`
- `bunx tsc --noEmit` — typecheck

No hay tests aún; cuando se agreguen, usar `bun test`.

## Arquitectura

- Entrada: `index.ts` carga el estado y ejecuta el loop del menú; `src/options.ts` es la única fuente de verdad para las opciones, sus teclas y sus acciones.
- Módulos en `src/`:
  - `types.ts` — tipos compartidos de estado, ciudad, geolocalización, pronóstico diario y unidades.
  - `menu.ts` — renderizado del menú a partir del registro de opciones.
  - `options.ts` — registro central de opciones; agregar una opción requiere implementar su acción y registrarla aquí.
  - `actions/` — acciones agrupadas por dominio: `weather.ts`, `cities.ts` y `settings.ts`.
  - `format.ts` — formato compartido de ubicaciones y unidades.
  - `api.ts` — funciones para consultar geocoding, clima actual y pronóstico diario de OpenMeteo.
  - `storage.ts` — carga y guardado del estado con `Bun.file` y `Bun.write`.
  - `prompts.ts` — lectura de entrada interactiva por stdin.
  - `colors.ts` — colores ANSI del menú (cyan), temperatura (amarillo) y mensajes de éxito/error (verde/rojo); desactivados sin TTY o con `NO_COLOR`.
- APIs (sin API key):
  1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=5&language=es&format=json`
  2. Forecast actual: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m&temperature_unit=<celsius|fahrenheit>`
  3. Forecast diario: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&daily=temperature_2m_min,temperature_2m_max&forecast_days=7&temperature_unit=<celsius|fahrenheit>&timezone=auto`
- Estado persistente en `data.json`, relativo al directorio actual de ejecución: ciudad default (`defaultCityId`), ciudades guardadas (`cities`) y unidades (`units`). Si el archivo no existe o está corrupto, la app inicia con el estado vacío y unidades Celsius.

## Convenciones

- TypeScript `strict` + `verbatimModuleSyntax`: importar tipos con `import type`.
- Bun carga `.env` automáticamente; no usar `dotenv`.
- Preferir APIs nativas de Bun (`Bun.file`, `bun:sqlite`, `fetch`) sobre paquetes externos. Guía completa en `bun-instructions.md`.
- Puedes usar `@bun-instrctions.md` para obtener instrucciones de Bun
