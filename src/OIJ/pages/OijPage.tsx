import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
} from 'lucide-react';

import OijSearchResults from '../components/OijSearchResults';
import OijStats from '../components/OijStats';
import OijAnalytics from '../components/OijAnalytics';

import {
  getOijFilters,
  getOijSummary,
  searchOij,
} from '../services/oij.service';

import type {
  OijRecord,
  OijFiltersData,
  OijSearchResponse,
  OijSummary,
} from '../types/oij.types';

const OijPage = () => {
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('');
  const [canton, setCanton] = useState('');
  const [crime, setCrime] = useState('');
  const [year, setYear] = useState('2026');
  const [filters, setFilters] = useState<OijFiltersData | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<OijRecord | null>(null);

  const [summary, setSummary] = useState<OijSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [searchData, setSearchData] =
    useState<OijSearchResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Cargar resumen general del OIJ.
   */
  useEffect(() => {
    const loadSummary = async () => {
      try {
        setSummaryLoading(true);

        const data = await getOijSummary(year);

        setSummary(data);
      } catch {
        /*
         * No mostramos error aquí todavía porque el backend
         * puede no estar implementado durante el desarrollo.
         */
        setSummary(null);
      } finally {
        setSummaryLoading(false);
      }
    };

    loadSummary();
  }, [year]);

  useEffect(() => {
    getOijFilters().then(setFilters).catch(() => setFilters(null));
  }, []);

  /**
   * Buscar registros.
   */
  const runSearch = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      setSearchData(null);

      const data = await searchOij({
        query,
        province,
        canton,
        crime,
        year,
        page,
        limit: 20,
      });

      setSearchData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No fue posible realizar la búsqueda.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    void runSearch(1);
  };

  /**
   * Por ahora solo dejamos preparado el evento.
   * Después podemos abrir un modal con todos los datos.
   */
  const handleOpenRecord = (record: OijRecord) => {
    setSelectedRecord(record);
  };

  return (
    <div className="oij-page">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="oij-hero">
        <div className="landing-container">
          <div className="oij-hero-grid">

            <div className="oij-hero-content">

              <div className="oij-source-label">
                <ShieldCheck size={15} />
                Fuente OSINT activa
              </div>

              <span className="landing-eyebrow">
                ORGANISMO DE INVESTIGACIÓN JUDICIAL
              </span>

              <h1>
                Estadísticas
                <span> Policiales</span>
              </h1>

              <p>
                Explora información estadística policial publicada como
                datos abiertos por el Poder Judicial de Costa Rica.
              </p>

              <div className="oij-source-meta">

                <div>
                  <CalendarDays size={17} />

                  <div>
                    <span>Período</span>
                    <strong>{year}</strong>
                  </div>
                </div>

                <div>
                  <MapPin size={17} />

                  <div>
                    <span>Cobertura</span>
                    <strong>Costa Rica</strong>
                  </div>
                </div>

              </div>
            </div>


            <div className="oij-source-panel">

              <span>FUENTE DE INFORMACIÓN</span>

              <h3>
                Poder Judicial de Costa Rica
              </h3>

              <p>
                La plataforma procesa los datos publicados por el OIJ para
                facilitar su búsqueda, filtrado y análisis.
              </p>

              <div className="oij-source-status">
                <span></span>
                Fuente pública
              </div>

              <a
                href="https://datosabiertospj.poder-judicial.go.cr/"
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

      <section className="oij-overview-section">
        <div className="landing-container">
          <OijAnalytics filters={filters} />
        </div>
      </section>


      {/* ==================================================
          RESUMEN
      ================================================== */}

      <section className="oij-overview-section">
        <div className="landing-container">

          <OijStats
            summary={summary}
            loading={summaryLoading}
          />

        </div>
      </section>


      {/* ==================================================
          BUSCADOR
      ================================================== */}

      <section className="oij-search-section">
        <div className="landing-container">

          <div className="oij-search-heading">

            <div>
              <span className="landing-eyebrow">
                EXPLORADOR DE DATOS
              </span>

              <h2>
                Busca dentro de las estadísticas
              </h2>
            </div>

            <p>
              Utiliza palabras clave y filtros para encontrar información
              específica dentro de los registros disponibles.
            </p>

          </div>


          <form
            className="oij-search-form"
            onSubmit={handleSearch}
          >

            <div className="oij-main-input">
              <Search size={20} />

              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ej: robo, fraude informático, Nicoya..."
              />
            </div>


            <div className="oij-filter">
              <label>Provincia</label>

              <select
                value={province}
                onChange={(event) =>
                  setProvince(event.target.value)
                }
              >
                <option value="">Todas</option>
                {filters?.provinces.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="oij-filter">
              <label>Cantón</label>
              <select value={canton} onChange={(event) => setCanton(event.target.value)}>
                <option value="">Todos</option>
                {filters?.cantons.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="oij-filter">
              <label>Delito</label>
              <select value={crime} onChange={(event) => setCrime(event.target.value)}>
                <option value="">Todos</option>
                {filters?.crimes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>


            <div className="oij-filter">
              <label>Año</label>

              <select
                value={year}
                onChange={(event) =>
                  setYear(event.target.value)
                }
              >
                {(filters?.years ?? [2026]).map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>


            <button
              className="oij-search-button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>

          </form>

        </div>
      </section>


      {/* ==================================================
          RESULTADOS
      ================================================== */}

      <section className="oij-results-section">
        <div className="landing-container">

          <div className="oij-results-heading">
            <span className="landing-eyebrow">
              RESULTADOS
            </span>

            <h2>
              Información disponible
            </h2>
          </div>


          <OijSearchResults
            data={searchData}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            onOpenRecord={handleOpenRecord}
            onPageChange={(page) => void runSearch(page)}
          />

        </div>
      </section>

      {selectedRecord && (
        <div className="record-modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <article className="record-modal" onClick={(event) => event.stopPropagation()}>
            <button className="record-modal-close" onClick={() => setSelectedRecord(null)}>Cerrar</button>
            <span className="landing-eyebrow">REGISTRO OIJ</span>
            <h2>{selectedRecord.delito || 'Registro policial'}</h2>
            <dl>
              <div><dt>Subdelito</dt><dd>{selectedRecord.subDelito || 'No indicado'}</dd></div>
              <div><dt>Fecha</dt><dd>{selectedRecord.fecha || 'No indicada'}</dd></div>
              <div><dt>Ubicación</dt><dd>{[selectedRecord.provincia, selectedRecord.canton, selectedRecord.distrito].filter(Boolean).join(', ') || 'No indicada'}</dd></div>
              <div><dt>Víctima</dt><dd>{selectedRecord.victima || 'No indicada'}</dd></div>
              <div><dt>Subvíctima</dt><dd>{selectedRecord.subVictima || 'No indicada'}</dd></div>
              <div><dt>Edad</dt><dd>{selectedRecord.edad || 'No indicada'}</dd></div>
              <div><dt>Sexo</dt><dd>{selectedRecord.sexo || 'No indicado'}</dd></div>
              <div><dt>Nacionalidad</dt><dd>{selectedRecord.nacionalidad || 'No indicada'}</dd></div>
            </dl>
            <p>Fuente: Poder Judicial de Costa Rica - Estadísticas Policiales.</p>
          </article>
        </div>
      )}

    </div>
  );
};

export default OijPage;
