# 02-weather

CLI de clima en TypeScript. Meta: app de consola (menú interactivo) que consulta OpenMeteo y al final se compila a un binario ejecutable.

## Comandos

Runtime es **Bun**, no Node:

- `bun install` — instalar dependencias
- `bun index.ts` — ejecutar la app
- `bunx tsc --noEmit` — typecheck (no hay script npm; `package.json` no define scripts)
- `bun build index.ts --compile --outfile weather` — binario ejecutable (meta del proyecto)

No hay tests aún; cuando existan, usar `bun test`.

## Arquitectura

- Entrada: `index.ts` (por ahora solo hello world; el menú de la app está prototipado en `README.md`).
- APIs (sin API key, ver ejemplos exactos en `README.md`):
  1. Geocoding: `https://geocoding-api.open-meteo.com/v1/search?name=<ciudad>&count=1&language=es&format=json`
  2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`
- Estado persistente requerido: ciudad default, lista de ciudades guardadas y ajuste de unidades (°C/°F). Definir almacenamiento antes de crecer la app.

## Convenciones

- TypeScript `strict` + `verbatimModuleSyntax`: importar tipos con `import type`.
- Bun carga `.env` automáticamente; no usar `dotenv`.
- Preferir APIs nativas de Bun (`Bun.file`, `bun:sqlite`, `fetch`) sobre paquetes externos. Guía completa en `bun-instructions.md`.
- Puedes usar `@bun-instrctions.md` para obtener instrucciones de Bun
