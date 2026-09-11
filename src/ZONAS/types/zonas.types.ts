export interface Canton {
  id: number;
  name: string;
}

export interface OsmMeta {
  source: string;
  providerUrl: string;
  retrievedAt: string;
  partial?: boolean;
  warnings?: string[];
}

export interface PoiFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] } | null;
  properties: {
    id: string;
    name: string;
    amenity: string;
    category: string;
  };
}

export interface PoiCollection {
  type: 'FeatureCollection';
  features: PoiFeature[];
  canton: Canton;
  meta: OsmMeta;
}

export interface CantonsResponse {
  data: Canton[];
  meta: OsmMeta;
}

export interface ZonasCategoryItem {
  key: string;
  label: string;
  count: number;
}