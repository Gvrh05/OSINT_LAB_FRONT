export interface OijRecord {
  id: string;

  fecha?: string;

  delito?: string;
  categoria?: string;
  subcategoria?: string;

  provincia?: string;
  canton?: string;
  distrito?: string;

  modalidad?: string;

  victima?: string;
  subDelito?: string;
  subVictima?: string;
  edad?: string;
  sexo?: string;
  nacionalidad?: string;

  descripcion?: string;

  [key: string]: unknown;
}

export interface OijSearchFilters {
  query?: string;
  year?: string;
  province?: string;
  canton?: string;
  crime?: string;

  page?: number;
  limit?: number;
}

export interface OijSearchResponse {
  query: string;
  total: number;

  page: number;
  limit: number;
  totalPages: number;

  results: OijRecord[];
}

export interface OijSummary {
  totalRecords: number;

  year?: number;

  totalProvinces?: number;
  totalCantons?: number;

  mostFrequentCrime?: string;

  lastUpdated?: string;
}

export interface OijTrendItem {
  label: string;
  value: number;
}

export interface OijCrimeItem {
  crime: string;
  total: number;
}

export interface OijLocationItem {
  name: string;
  total: number;
}

export interface OijFiltersData {
  years: number[];
  provinces: string[];
  cantons: string[];
  crimes: string[];
}

export type OijStatisticsGroup = 'year' | 'month' | 'province' | 'crime';

export interface OijStatisticsItem {
  label: string;
  value: number;
  percentage: number;
}

export interface OijStatisticsResponse {
  groupBy: OijStatisticsGroup;
  total: number;
  filters: {
    year: string;
    month: string;
    province: string;
    crime: string;
  };
  items: OijStatisticsItem[];
}

export interface OijApiError {
  message: string;
  statusCode?: number;
}
