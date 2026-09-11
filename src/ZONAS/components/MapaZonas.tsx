import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import PoisLayer from './PoisLayer';

import type { PoiFeature } from '../types/zonas.types';

const CR_CENTER: [number, number] = [9.7489, -84.256];

interface MapaZonasProps {
  features: PoiFeature[];
  categoryColors: Record<string, string>;
}

export default function MapaZonas({
  features,
  categoryColors,
}: MapaZonasProps) {
  return (
    <MapContainer
      className="zonas-map"
      center={CR_CENTER}
      zoom={8}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {features.length > 0 && (
        <PoisLayer
          features={features}
          categoryColors={categoryColors}
        />
      )}
    </MapContainer>
  );
}