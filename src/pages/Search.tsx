import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Filter, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import OijSearchResults from '../OIJ/components/OijSearchResults';
import { getOijFilters } from '../OIJ/services/oij.service';
import type { OijFiltersData, OijRecord, OijSearchResponse } from '../OIJ/types/oij.types';
import { searchOsint } from '../services/osint.service';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [province, setProvince] = useState('');
  const [year, setYear] = useState('2026');
  const [filters, setFilters] = useState<OijFiltersData | null>(null);
  const [data, setData] = useState<OijSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<OijRecord | null>(null);
  const currentQuery = searchParams.get('q') ?? '';

  useEffect(() => {
    getOijFilters().then(setFilters).catch(() => setFilters(null));
  }, []);

  const runSearch = async (searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) return setData(null);
    try {
      setLoading(true);
      setError(null);
      setData(await searchOsint({ query: searchQuery, source: 'all', province, year, page, limit: 20 }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No fue posible realizar la búsqueda.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (currentQuery) void runSearch(currentQuery, 1);
    }, 0);
    return () => window.clearTimeout(timer);
    // Los filtros se aplican al presionar Buscar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuery]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    setSearchParams(value ? { q: value } : {});
    if (value === currentQuery) void runSearch(value, 1);
  };

  const handleClear = () => {
    setQuery('');
    setProvince('');
    setData(null);
    setSearchParams({});
  };

  return (
    <div className="search-page">
      <section className="search-page-header">
        <div className="landing-container">
          <span className="landing-eyebrow">EXPLORADOR OSINT</span>
          <h1>Busca información<span> pública.</span></h1>
          <p>Consulta las fuentes integradas desde una sola búsqueda.</p>
          <form className="search-page-form" onSubmit={handleSearch}>
            <div className="search-page-input">
              <SearchIcon size={21} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej: robo, Guanacaste, Nicoya..." />
              {query && <button type="button" className="clear-search" onClick={handleClear}>Limpiar</button>}
            </div>
            <button type="submit" className="search-submit" disabled={loading}>Buscar <ArrowRight size={18} /></button>
          </form>
        </div>
      </section>

      <section className="search-content">
        <div className="landing-container">
          <div className="search-toolbar">
            <div><span className="search-toolbar-label">RESULTADOS</span><h2>{currentQuery ? `Resultados para “${currentQuery}”` : 'Explora los datos disponibles'}</h2></div>
            <div className="filter-button"><SlidersHorizontal size={17} /> Filtros</div>
          </div>
          <div className="search-layout">
            <aside className="search-filters">
              <div className="filter-heading"><Filter size={17} /><strong>Filtrar resultados</strong></div>
              <div className="filter-group"><label>Fuente</label><select disabled><option>OIJ - Estadísticas Policiales</option></select></div>
              <div className="filter-group"><label>Provincia</label><select value={province} onChange={(event) => setProvince(event.target.value)}><option value="">Todas</option>{filters?.provinces.map((item) => <option key={item}>{item}</option>)}</select></div>
              <div className="filter-group"><label>Año</label><select value={year} onChange={(event) => setYear(event.target.value)}>{(filters?.years ?? [2026]).map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              <button className="clear-filters" onClick={handleClear}>Limpiar filtros</button>
            </aside>
            <div className="search-results">
              <OijSearchResults data={data} loading={loading} error={error} hasSearched={Boolean(currentQuery)} onOpenRecord={setSelectedRecord} onPageChange={(page) => void runSearch(currentQuery, page)} />
            </div>
          </div>
        </div>
      </section>

      {selectedRecord && (
        <div className="record-modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <article className="record-modal" onClick={(event) => event.stopPropagation()}>
            <button className="record-modal-close" onClick={() => setSelectedRecord(null)}>Cerrar</button>
            <span className="landing-eyebrow">RESULTADO OIJ</span>
            <h2>{selectedRecord.delito}</h2>
            <dl>
              <div><dt>Subdelito</dt><dd>{selectedRecord.subDelito || 'No indicado'}</dd></div>
              <div><dt>Fecha</dt><dd>{selectedRecord.fecha || 'No indicada'}</dd></div>
              <div><dt>Ubicación</dt><dd>{[selectedRecord.provincia, selectedRecord.canton, selectedRecord.distrito].filter(Boolean).join(', ')}</dd></div>
              <div><dt>Víctima</dt><dd>{selectedRecord.victima || 'No indicada'}</dd></div>
            </dl>
            <p>Fuente: Poder Judicial de Costa Rica.</p>
          </article>
        </div>
      )}
    </div>
  );
};

export default Search;
