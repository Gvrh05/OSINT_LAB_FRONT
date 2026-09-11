import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

import type { PoiFeature } from '../types/zonas.types';

interface PoisLayerProps {
  features: PoiFeature[];
  categoryColors: Record<string, string>;
  defaultColor?: string;
}

export default function PoisLayer({
  features,
  categoryColors,
  defaultColor = '#64748b',
}: PoisLayerProps) {
  const map = useMap();

  useEffect(() => {
    const geo = L.geoJSON(features as unknown as GeoJSON.FeatureCollection, {
      pointToLayer: (feature, latlng) => {
        const props = feature.properties as PoiFeature['properties'];
        const color =
          categoryColors[props.category] ?? defaultColor;

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
  }, [map, features, categoryColors, defaultColor]);

  return null;
}