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
