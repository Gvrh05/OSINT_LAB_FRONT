import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapPinned, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

import { PoisLayer } from '../components/PoisLayer';
import {
  getOsmCantons,
  getOsmPois,
} from '../services/osm.service';

import type {
  Canton,
  PoiCollection,
} from '../types/osm.types';

const CATEGORIES = [
  { key: 'salud', label: 'Salud y farmacia' },
  { key: 'educacion', label: 'Educación' },
  { key: 'emergencia', label: 'Bomberos / Policía' },
  { key: 'combustible', label: 'Gasolineras' },
  { key: 'banco', label: 'Bancos / Cajeros' },
  { key: 'supermercado', label: 'Supermercados' },
  { key: 'culto', label: 'Lugares de culto' },
];

const CR_CENTER: [number, number] = [9.7489, -84.256];

const formatHora = (iso?: string): string => {
  if (!iso) return 'No disponible';
  try {
    return new Date(iso).toLocaleString('es-CR');
  } catch {
    return 'No disponible';
  }
};

const ZonasPage = () => {
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [cantonId, setCantonId] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('salud');
  const [pois, setPois] = useState<PoiCollection | null>(null);
  const [cantonError, setCantonError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const canton = useMemo(
    () => cantons.find((c) => c.id === cantonId),
    [cantons, cantonId],
  );
  const totalPois = useMemo(
    () => (pois ? pois.features.length : 0),
    [pois],
  );

  const loadCantons = useCallback(() => {
    setCantonError(null);
    getOsmCantons()
      .then((r) => {
        setCantons(r.data);
        const defaultCanton =
          r.data.find((c) => c.id === 4069041 && c.name === 'San José') ??
          r.data[0];
        setCantonId(defaultCanton ? defaultCanton.id : '');
      })
      .catch((e: Error) => setCantonError(e.message));
  }, []);

  useEffect(() => {
    loadCantons();
  }, [loadCantons]);

  useEffect(() => {
    if (cantonId === '') return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPois(null);
    getOsmPois(cantonId, category || undefined)
      .then((r) => {
        if (!cancelled) setPois(r);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cantonId, category, reloadToken]);

  const summary = useMemo(() => {
    if (!pois) return [];
    const counts: Record<string, number> = {};
    for (const f of pois.features) {
      counts[f.properties.category] =
        (counts[f.properties.category] ?? 0) + 1;
    }
    return CATEGORIES.map((c) => ({ ...c, count: counts[c.key] ?? 0 })).filter(
      (c) => c.count > 0,
    );
  }, [pois]);

  return (
    <div className="page zonas-page">
      <header className="page-heading internal-heading zonas-heading">
        <div>
          <span className="section-eyebrow">FUENTE 3 &middot; OSM</span>
          <h1>Explorador territorial</h1>
          <p className="description">
            Infraestructura y puntos de interés desde{' '}
            <strong>OpenStreetMap</strong> (Overpass API), organizados por
            cantón.
          </p>
        </div>

        <div className="heading-metric">
          <strong>{totalPois}</strong>
          <span>Puntos de interés</span>
        </div>
      </header>

      <section className="zonas-controls">
        <label>
          Cantón
          <select
            value={cantonId}
            onChange={(e) =>
              setCantonId(e.target.value === '' ? '' : Number(e.target.value))
            }
          >
            {!cantonId && <option value="">Seleccione&hellip;</option>}
            {cantons.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoría
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        {cantonError && (
          <button className="zonas-retry" onClick={loadCantons}>
            <RefreshCw size={15} />
            Reintentar cantones
          </button>
        )}
      </section>

      {error && (
        <div className="zonas-banner zonas-error">
          <strong>No se pudieron obtener los datos de la fuente:</strong> {error}
          <button
            className="zonas-banner-action"
            onClick={() => setReloadToken((t) => t + 1)}
          >
            Reintentar
          </button>
        </div>
      )}
      {cantonError && !error && (
        <div className="zonas-banner zonas-error">
          <strong>No se pudo obtener la lista de cantones:</strong> {cantonError}
        </div>
      )}
      {pois?.meta.partial && (
        <div className="zonas-banner zonas-warn">
          <strong>Algunas categorías no cargaron desde la fuente:</strong>{' '}
          {pois.meta.warnings?.join(' · ')}
        </div>
      )}

      <main className="zonas-layout">
        <div className="zonas-map-box">
          <MapContainer
            center={CR_CENTER}
            zoom={8}
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pois && <PoisLayer features={pois.features} />}
          </MapContainer>
        </div>

        <aside className="zonas-panel">
          <div className="zonas-panel-title">
            <MapPinned size={18} />
            <h2>{canton ? canton.name : '—'}</h2>
          </div>

          <p className="zonas-muted">
            {loading
              ? 'Consultando Overpass API&hellip;'
              : totalPois > 0
                ? `${totalPois} punto(s) de interés`
                : 'Sin puntos de interés para esta selección.'}
          </p>

          {!loading && summary.length > 0 && (
            <table className="zonas-summary">
              <tbody>
                {summary.map((c) => (
                  <tr key={c.key}>
                    <td>{c.label}</td>
                    <td className="num">{c.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pois && (
            <div className="zonas-provenance">
              <strong>Procedencia de los datos</strong>
              <div>Fuente: {pois.meta.source}</div>
              <div>Obtenido: {formatHora(pois.meta.retrievedAt)}</div>
              <div className="zonas-muted">
                Datos &copy; OpenStreetMap (licencia ODbL)
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
};

export default ZonasPage;