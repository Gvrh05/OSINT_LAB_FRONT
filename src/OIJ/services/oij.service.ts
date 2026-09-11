import type {
  OijCrimeItem,
  OijFiltersData,
  OijLocationItem,
  OijSearchFilters,
  OijSearchResponse,
  OijSummary,
  OijStatisticsGroup,
  OijStatisticsResponse,
  OijTrendItem,
} from '../types/oij.types';

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/**
 * Realiza una petición al backend.
 */
async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let message = 'No fue posible obtener la información del OIJ.';

    try {
      const error = await response.json();

      if (error?.message) {
        message = Array.isArray(error.message)
          ? error.message.join(', ')
          : error.message;
      }
    } catch {
      // Mantiene el mensaje genérico.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}


/**
 * Convierte los filtros seleccionados en parámetros de URL.
 */
function buildSearchParams(filters: OijSearchFilters): string {
  const params = new URLSearchParams();

  if (filters.query?.trim()) {
    params.set('q', filters.query.trim());
  }

  if (filters.year) {
    params.set('year', filters.year);
  }

  if (filters.province) {
    params.set('province', filters.province);
  }

  if (filters.canton) {
    params.set('canton', filters.canton);
  }

  if (filters.crime) {
    params.set('crime', filters.crime);
  }

  if (filters.page) {
    params.set('page', String(filters.page));
  }

  if (filters.limit) {
    params.set('limit', String(filters.limit));
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
}


/**
 * Busca registros policiales.
 *
 * Ejemplo:
 * /api/oij/search?q=robo&province=Guanacaste&year=2026
 */
export function searchOij(
  filters: OijSearchFilters,
): Promise<OijSearchResponse> {
  const params = buildSearchParams(filters);

  return request<OijSearchResponse>(`/oij/search${params}`);
}


/**
 * Obtiene estadísticas generales del conjunto de datos.
 */
export function getOijSummary(
  year?: string,
): Promise<OijSummary> {
  const params = year
    ? `?year=${encodeURIComponent(year)}`
    : '';

  return request<OijSummary>(`/oij/summary${params}`);
}


/**
 * Obtiene las opciones disponibles para los filtros.
 *
 * Por ejemplo:
 * - años
 * - provincias
 * - delitos
 */
export function getOijFilters(): Promise<OijFiltersData> {
  return request<OijFiltersData>('/oij/filters');
}


/**
 * Obtiene los datos para gráficos de tendencia.
 */
export function getOijTrends(
  year?: string,
): Promise<OijTrendItem[]> {
  const params = year
    ? `?year=${encodeURIComponent(year)}`
    : '';

  return request<OijTrendItem[]>(`/oij/trends${params}`);
}


/**
 * Obtiene delitos o categorías con mayor cantidad de registros.
 */
export function getOijCrimes(
  year?: string,
): Promise<OijCrimeItem[]> {
  const params = year
    ? `?year=${encodeURIComponent(year)}`
    : '';

  return request<OijCrimeItem[]>(`/oij/crimes${params}`);
}


/**
 * Obtiene información agrupada geográficamente.
 */
export function getOijLocations(
  year?: string,
): Promise<OijLocationItem[]> {
  const params = year
    ? `?year=${encodeURIComponent(year)}`
    : '';

  return request<OijLocationItem[]>(`/oij/locations${params}`);
}

export function getOijStatistics(filters: {
  groupBy: OijStatisticsGroup;
  year?: string;
  month?: string;
  province?: string;
  crime?: string;
}): Promise<OijStatisticsResponse> {
  const params = new URLSearchParams({ groupBy: filters.groupBy });
  if (filters.year) params.set('year', filters.year);
  if (filters.month) params.set('month', filters.month);
  if (filters.province) params.set('province', filters.province);
  if (filters.crime) params.set('crime', filters.crime);
  return request<OijStatisticsResponse>(`/oij/statistics?${params.toString()}`);
}
