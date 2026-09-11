import type { OijRecord } from '../OIJ/types/oij.types';

export interface GlobalSearchFilters {
  query: string;
  source?: string;
  province?: string;
  year?: string;
  page?: number;
  limit?: number;
}

export interface GlobalSearchRecord extends OijRecord {
  source: string;
  institution: string;
  dataset: string;
}

export interface GlobalSearchResponse {
  query: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  sources: string[];
  results: GlobalSearchRecord[];
}
