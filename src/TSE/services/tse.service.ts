import type {
  TseCantonesResponse,
  TseDistritosResponse,
  TseStats,
  TseStatus,
} from '../types/tse.types';

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
    let message = 'No fue posible obtener la información del TSE.';

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

export function getTseStatus(): Promise<TseStatus> {
  return request<TseStatus>('/tse/status');
}

export function getTseStats(): Promise<TseStats> {
  return request<TseStats>('/tse/stats');
}

export function getTseCantones(
  provincia: string,
): Promise<TseCantonesResponse> {
  return request<TseCantonesResponse>(
    `/tse/stats/cantones?provincia=${encodeURIComponent(provincia)}`,
  );
}

export function getTseDistritos(): Promise<TseDistritosResponse> {
  return request<TseDistritosResponse>('/tse/distritos-electorales');
}