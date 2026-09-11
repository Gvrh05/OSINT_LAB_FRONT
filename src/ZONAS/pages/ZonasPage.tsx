import { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  Layers,
  MapPin,
  RefreshCw,
  Satellite,
} from 'lucide-react';

import MapaZonas from '../components/MapaZonas';

import {
  getCantones,
  getPois,
} from '../services/zonas.service';

import type {
  Canton,
  PoiCollection,
  ZonasCategoryItem,
} from '../types/zonas.types';

const CATEGORIES: ZonasCategoryItem[] = [
  { key: 'salud', label: 'Salud y farmacia', count: 0 },
  { key: 'educacion', label: 'Educación', count: 0 },
  { key: 'emergencia', label: 'Bomberos / Policía', count: 0 },
  { key: 'combustible', label: 'Gasolineras', count: 0 },
  { key: 'banco', label: 'Bancos / Cajeros', count: 0 },
  { key: 'supermercado', label: 'Supermercados', count: 0 },
  { key: 'culto', label: 'Lugares de culto', count: 0 },
];

const CATEGORY_COLORS: Record<string, string> = {
  salud: '#c0392b',
  educacion: '#2980b9',
  emergencia: '#e67e22',
  combustible: '#8e44ad',
  banco: '#27ae60',
  supermercado: '#16a085',
  culto: '#7f8c8d',
  otros: '#95a5a6',
};

const OSM_FUENTE_URL = 'https://www.openstreetmap.org/';

const formatFecha = (iso?: string | null): string => {
  if (!iso) return 'No disponible';
  try {
    return new Date(iso).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'No disponible';
  }
};

const ZonasPage = () => {
  const [cantons, setCantons] = useState<Canton[]>([]);
  const [cantonId, setCantonId] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('salud');
  const [pois, setPois] = useState<PoiCollection | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingCantons, setLoadingCantons] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cantonsError, setCantonsError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const canton = useMemo(
    () => cantons.find((c) => c.id === cantonId),
    [cantons, cantonId],
  );

  const totalPois = useMemo(
    () => (pois ? pois.features.length : 0),
    [pois],
  );

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setCantonsError(null);
      setLoadingCantons(true);

      try {
        const data = await getCantones();
        if (cancelled) return;
        setCantons(data.data);

        const defaultCanton =
          data.data.find(
            (c) => c.id === 4069041 && c.name === 'San José',
          ) ?? data.data[0];

        if (defaultCanton) setCantonId(defaultCanton.id);
      } catch (err) {
        if (cancelled) return;
        setCantonsError(
          err instanceof Error
            ? err.message
            : 'No fue posible cargar los cantones.',
        );
      } finally {
        if (!cancelled) setLoadingCantons(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (cantonId === '') return;

    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      setPois(null);

      try {
        const data = await getPois(cantonId, category || undefined);
        if (cancelled) return;
        setPois(data);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible obtener los puntos de interés.',
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cantonId, category, reloadToken]);

  const summary = useMemo(() => {
    if (!pois) return [];
    const counts: Record<string, number> = {};
    for (const feature of pois.features) {
      counts[feature.properties.category] =
        (counts[feature.properties.category] ?? 0) + 1;
    }
    return CATEGORIES.map((c) => ({
      ...c,
      count: counts[c.key] ?? 0,
    })).filter((c) => c.count > 0);
  }, [pois]);

  return (
    <div className="zonas-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="oij-hero zonas-hero">
        <div className="landing-container">
          <div className="oij-hero-grid">

            <div className="oij-hero-content">

              <div className="oij-source-label">
                <Satellite size={15} />
                Fuente OSINT activa
              </div>

              <span className="landing-eyebrow">
                EXPLORADOR TERRITORIAL · OPENSTREETMAP
              </span>

              <h1>
                Infraestructura
                <span> de Costa Rica</span>
              </h1>

              <p>
                Mapa de puntos de interés levantados por la comunidad de
                OpenStreetMap y consultados vía la API de Overpass,
                organizados por cantón.
              </p>

              <div className="oij-source-meta">

                <div>
                  <MapPin size={17} />

                  <div>
                    <span>Cobertura</span>
                    <strong>84 cantones</strong>
                  </div>
                </div>

                <div>
                  <Layers size={17} />

                  <div>
                    <span>Fuente</span>
                    <strong>OpenStreetMap</strong>
                  </div>
                </div>

              </div>
            </div>


            <div className="oij-source-panel">

              <span>FUENTE DE INFORMACIÓN</span>

              <h3>
                OpenStreetMap
              </h3>

              <p>
                Datos geográficos colaborativos procesados por la
                plataforma para consultar infraestructura y servicios
                por cantón.
              </p>

              <div className="oij-source-status">
                <span></span>
                Fuente abierta
              </div>

              <a
                href={OSM_FUENTE_URL}
                target="_blank"
                rel="noreferrer"
              >
                Consultar fuente oficial
                <ExternalLink size={15} />
              </a>

            </div>

          </div>
        </div>
      </section>


      {/* ==================================================
          EXPLORADOR
      ================================================== */}

      <section className="zonas-explorador-section">
        <div className="landing-container">

          <div className="oij-search-heading zonas-heading">

            <div>
              <span className="landing-eyebrow">
                EXPLORADOR TERRITORIAL
              </span>

              <h2>
                Consulta los puntos de interés por cantón
              </h2>
            </div>

            <p>
              Selecciona un cantón y una categoría para visualizar la
              infraestructura registrada en OpenStreetMap.
            </p>

          </div>

          <div className="zonas-panel">

            <div className="zonas-toolbar">

              <label className="zonas-select">
                <span>Cantón</span>

                <select
                  value={cantonId}
                  onChange={(event) =>
                    setCantonId(
                      event.target.value === ''
                        ? ''
                        : Number(event.target.value),
                    )
                  }
                  disabled={loadingCantons}
                >
                  {!cantonId && (
                    <option value="">Seleccione…</option>
                  )}
                  {cantons.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="zonas-select">
                <span>Categoría</span>

                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                >
                  <option value="">Todas</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="zonas-refresh"
                onClick={() => setReloadToken((t) => t + 1)}
                title="Recargar puntos de interés"
              >
                <RefreshCw size={16} />
                Recargar
              </button>

            </div>

            {cantonsError && (
              <div className="zonas-banner error">
                <strong>Error cargando cantones:</strong>{' '}
                {cantonsError}
                <button
                  className="zonas-banner-action"
                  onClick={() => setReloadToken((t) => t + 1)}
                  type="button"
                >
                  Reintentar
                </button>
              </div>
            )}

            {error && (
              <div className="zonas-banner error">
                <strong>No se pudo obtener datos de la fuente:</strong>{' '}
                {error}
                <button
                  className="zonas-banner-action"
                  onClick={() => setReloadToken((t) => t + 1)}
                  type="button"
                >
                  Reintentar
                </button>
              </div>
            )}

            {pois?.meta.partial && (
              <div className="zonas-banner warning">
                <strong>
                  Algunas categorías no cargaron desde la fuente:
                </strong>{' '}
                {pois.meta.warnings?.join(' · ')}
              </div>
            )}

            <div className="zonas-layout">
              <div className="zonas-map-box">
                <MapaZonas
                  features={pois?.features ?? []}
                  categoryColors={CATEGORY_COLORS}
                />
              </div>

              <aside className="zonas-aside">
                <h3>{canton ? canton.name : '—'}</h3>

                <p className="zonas-aside-muted">
                  {loading
                    ? 'Consultando Overpass API…'
                    : totalPois > 0
                      ? `${totalPois} punto(s) de interés`
                      : 'Sin puntos de interés para esta selección.'}
                </p>

                <div className="oij-source-status zonas-aside-status">
                  <span></span>
                  {canton ? `Cantón de ${canton.name}` : 'Cantón no seleccionado'}
                </div>

                {!loading && summary.length > 0 && (
                  <div className="zonas-summary">
                    <div className="zonas-summary-title">
                      Resumen por categoría
                    </div>

                    {summary.map((c) => (
                      <div
                        key={c.key}
                        className="zonas-summary-row"
                      >
                        <span
                          className="zonas-dot"
                          style={{
                            background:
                              CATEGORY_COLORS[c.key] ?? CATEGORY_COLORS.otros,
                          }}
                        />
                        <span>{c.label}</span>
                        <strong>{c.count}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {pois && (
                  <div className="tse-provenance zonas-provenance">
                    <strong>Procedencia de los datos</strong>
                    <div>Fuente: {pois.meta.source}</div>
                    <div>
                      Obtenido: {formatFecha(pois.meta.retrievedAt)}
                    </div>
                    <div className="tse-responsible">
                      Datos © OpenStreetMap (licencia ODbL)
                    </div>
                  </div>
                )}
              </aside>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ZonasPage;