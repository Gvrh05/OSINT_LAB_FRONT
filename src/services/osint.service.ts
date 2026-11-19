import type { GlobalSearchFilters, GlobalSearchResponse } from '../types/osint.types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export async function searchOsint(filters: GlobalSearchFilters): Promise<GlobalSearchResponse> {
  const params = new URLSearchParams();
  params.set('q', filters.query.trim());
  if (filters.source && filters.source !== 'all') params.set('source', filters.source);
  if (filters.province) params.set('province', filters.province);
  if (filters.year) params.set('year', filters.year);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 20));

  const response = await fetch(`${API_URL}/search?${params.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('No fue posible consultar las fuentes disponibles.');
  return response.json() as Promise<GlobalSearchResponse>;
}
