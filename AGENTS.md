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

- Entrada: `src/index.ts` carga el estado y ejecuta el loop del menú; `src/presentation/menu.ts` contiene el registro único de opciones, teclas y acciones.
- Módulos en `src/`:
  - `actions/` — una acción por archivo; `listCities.ts` comparte el listado y la selección de ciudades.
  - `api/` — `geocoding.ts` y `weather.ts` consultan OpenMeteo; `client.ts` comparte el cliente HTTP.
  - `presentation/` — menú, entrada por stdin, salida y spinner.
  - `storage/` — `citiesStorage.ts` y `settingsStorage.ts` guardan sus secciones mediante `stateFile.ts` en un único `data.json`.
  - `types/` — contratos compartidos de ciudad, clima, opciones del menú y estado.
  - `utils/` — formato, constantes y colores ANSI (cyan para menú, amarillo para temperatura, verde/rojo para mensajes); colores desactivados sin TTY o con `NO_COLOR`.
  - `index.ts` — punto de entrada de la CLI.
- APIs (sin API key):
  1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=5&language=es&format=json`
  2. Forecast actual: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m&temperature_unit=<celsius|fahrenheit>`
  3. Forecast diario: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&daily=temperature_2m_min,temperature_2m_max&forecast_days=7&temperature_unit=<celsius|fahrenheit>&timezone=auto`
- Estado persistente en `data.json`, relativo al directorio actual de ejecución: ciudad default (`defaultCityId`), ciudades guardadas (`cities`) y unidades (`units`). Si el archivo no existe o está corrupto, la app inicia con el estado vacío y unidades Celsius.
- El pronóstico de 7 días permite seleccionar cualquier ciudad guardada.

## Convenciones

- TypeScript `strict` + `verbatimModuleSyntax`: importar tipos con `import type`.
- Bun carga `.env` automáticamente; no usar `dotenv`.
- Preferir APIs nativas de Bun (`Bun.file`, `bun:sqlite`, `fetch`) sobre paquetes externos. Guía completa en `bun-instructions.md`.
- Puedes usar `@bun-instrctions.md` para obtener instrucciones de Bun
