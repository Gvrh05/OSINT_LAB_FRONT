import type {
  CantonsResponse,
  PoiCollection,
} from '../types/osm.types';

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/**
 * Realiza una petición al backend.
 */
async function request<T>(endpoint: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor de datos.');
  }

  if (!response.ok) {
    let message = 'No se pudo obtener la información territorial.';

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
 * Obtiene los cantones disponibles para la exploración.
 */
export function getOsmCantons(): Promise<CantonsResponse> {
  return request<CantonsResponse>('/osm/cantons');
}

/**
 * Obtiene los puntos de interés de un cantón.
 *
 * Ejemplo:
 * /api/osm/pois?canton=4069041&categoria=salud
 */
export function getOsmPois(
  cantonId: number,
  categoria?: string,
): Promise<PoiCollection> {
  const params = new URLSearchParams({ canton: String(cantonId) });

  if (categoria) {
    params.set('categoria', categoria);
  }

  return request<PoiCollection>(`/osm/pois?${params.toString()}`);
}