import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import type { PoiFeature } from '../types/osm.types';

export const CATEGORY_COLORS: Record<string, string> = {
  salud: '#c0392b',
  educacion: '#2980b9',
  emergencia: '#e67e22',
  combustible: '#8e44ad',
  banco: '#27ae60',
  supermercado: '#16a085',
  culto: '#7f8c8d',
  otros: '#95a5a6',
};

export function PoisLayer({ features }: { features: PoiFeature[] }) {
  const map = useMap();

  useEffect(() => {
    const geo = L.geoJSON(features as unknown as GeoJSON.FeatureCollection, {
      pointToLayer: (feature, latlng) => {
        const props = feature.properties as PoiFeature['properties'];
        const color = CATEGORY_COLORS[props.category] ?? CATEGORY_COLORS.otros;

        return L.circleMarker(latlng, {
          radius: 6,
          color: '#ffffff',
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.9,
        });
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as PoiFeature['properties'];
        layer.bindPopup(
          `<strong>${props.name}</strong><br/><em>${props.amenity}</em>`,
        );
      },
    });

    geo.addTo(map);

    if (features.length > 0) {
      const bounds = geo.getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, {
          padding: [30, 30],
          maxZoom: 14,
          duration: 0.6,
        });
      }
    }

    return () => {
      map.removeLayer(geo);
    };
  }, [map, features]);

  return null;
}