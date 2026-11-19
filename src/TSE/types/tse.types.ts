export interface TseLoadMetadata {
  fuente: string;
  fechaDescarga: string;
  registros: number;
  archivo: string;
}

export interface TseStatus {
  cargado: boolean;
  registros: number;
  distritosElectorales: number;
  cargando: boolean;
  metadata: TseLoadMetadata | null;
}

export interface TseCantonStat {
  canton: string;
  electores: number;
}

export interface TseProvinciaStat {
  provincia: string;
  electores: number;
  porcentaje: number;
  cantones: TseCantonStat[];
}

export interface TseStats {
  total: number;
  distritosElectorales: number;
  porProvincia: TseProvinciaStat[];
  metadata: TseLoadMetadata | null;
}

export interface TseCantonesResponse {
  provincia: string;
  electores: number;
  cantones: TseCantonStat[];
  metadata: TseLoadMetadata | null;
}

export interface TseDistritoElectoral {
  codigo: string;
  provincia: string;
  canton: string;
  distrito: string;
}

export interface TseDistritosResponse {
  distritos: TseDistritoElectoral[];
  metadata: TseLoadMetadata | null;
}