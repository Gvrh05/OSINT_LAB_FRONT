# OSINT CR - Frontend

Interfaz React para consultar fuentes públicas de Costa Rica.

## Requisitos

- Node.js 20 o superior
- pnpm

## Ejecución

```bash
pnpm install
cp .env.example .env
pnpm dev
```

El sitio se abre en `http://localhost:5173` y espera la API en
`http://localhost:3000/api`.

## Estructura

- `src/pages`: páginas generales de la plataforma.
- `src/OIJ`: componentes, página, servicio y tipos exclusivos del OIJ.
- `src/services`: integración común para la búsqueda global.
- `src/components/layout`: navegación y estructura compartida.

## Funciones disponibles

- Búsqueda global conectada al endpoint común.
- Consulta especializada de Estadísticas Policiales del OIJ.
- Consulta histórica de los años 2023, 2024, 2025 y 2026.
- Gráficos interactivos de barras y circulares por año, mes, provincia o delito.
- Filtros cargados desde los valores reales del conjunto de datos.
- Paginación y detalle de cada registro.
- Estados de carga, error y ausencia de resultados.

## DevSecOps, pruebas E2E y despliegue

`.github/workflows/security.yml` ejecuta Gitleaks, Semgrep y `pnpm audit` para `develop` y `main`. OWASP ZAP baseline se activa cuando la variable de repositorio `APP_URL` contiene la URL **pública y autorizada** de este frontend. Los análisis permiten ver todos los hallazgos en los logs. `.github/workflows/playwright.yml` trae el backend OSINT real desde `Gvrh05/OSINT_LAB_BACK` (rama `develop`), compila ambos proyectos y ejecuta tres flujos navegador + API sin simular datos externos.

En local, primero instala y compila el backend hermano (`../OSINT_LAB_BACK`), luego ejecuta:

```powershell
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright levanta backend y frontend en los puertos aislados 43120 y 43121, sin interferir con los servidores de desarrollo. Deshabilita la descarga masiva del padrón durante estas pruebas; el módulo OIJ sigue siendo real. `pnpm build` compila el frontend.

`render.yaml` permite crear el frontend estático en Render con reescritura de rutas SPA. En Render configura `VITE_API_URL` como la **URL HTTPS pública del backend terminada en `/api` antes de construir**. En el backend configura `FRONTEND_URL` con la URL HTTPS que Render asigne al frontend. Conecta ambos repositorios y verifica en el navegador búsqueda, fuentes y peticiones de red a la API; el hecho de tener este archivo **no significa que se haya desplegado**. Guarda los enlaces y reportes de GitHub Actions para tu evaluación.

Análisis manual en PowerShell (en esta carpeta):

```powershell
python -m pip install semgrep
semgrep scan --config auto .
pnpm audit --audit-level low
winget install Gitleaks.Gitleaks
gitleaks git . --redact
New-Item -ItemType Directory -Force reports | Out-Null
docker run --rm -v "${PWD}/reports:/zap/wrk/:rw" ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://TU-FRONTEND-PUBLICO -r zap-front.html -I
```
