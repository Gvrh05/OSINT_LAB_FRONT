import type {
  CantonsResponse,
  PoiCollection,
} from '../types/zonas.types';

const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    let message = 'No fue posible obtener la información de OpenStreetMap.';

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

export function getCantones(): Promise<CantonsResponse> {
  return request<CantonsResponse>('/osm/cantons');
}

export function getPois(
  cantonId: number,
  categoria?: string,
): Promise<PoiCollection> {
  const params = new URLSearchParams({ canton: String(cantonId) });
  if (categoria) params.set('categoria', categoria);
  return request<PoiCollection>(`/osm/pois?${params.toString()}`);
}