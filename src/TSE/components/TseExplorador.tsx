import { useEffect, useMemo, useState } from 'react';
import { Landmark, MapPinned, Search, Users } from 'lucide-react';

import { getTseDistritos } from '../services/tse.service';
import type {
  TseDistritoElectoral,
  TseStats,
} from '../types/tse.types';

const MAX_ROWS = 120;

interface TseExploradorProps {
  stats: TseStats | null;
  loading?: boolean;
}

const TseExplorador = ({ stats, loading = false }: TseExploradorProps) => {
  const [tab, setTab] = useState<'cantones' | 'distritos'>('cantones');
  const [query, setQuery] = useState('');
  const [distritos, setDistritos] = useState<TseDistritoElectoral[]>([]);
  const [distritoError, setDistritoError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getTseDistritos()
      .then((response) => {
        if (active) setDistritos(response.distritos);
      })
      .catch((error: Error) => {
        if (active) setDistritoError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const cantones = useMemo(() => {
    if (!stats) return [];
    const rows: { provincia: string; canton: string; electores: number }[] = [];
    for (const provincia of stats.porProvincia) {
      for (const canton of provincia.cantones) {
        rows.push({
          provincia: provincia.provincia,
          canton: canton.canton,
          electores: canton.electores,
        });
      }
    }
    return rows.sort((a, b) => b.electores - a.electores);
  }, [stats]);

  const q = query.trim().toLowerCase();

  const cantonesFiltrados = useMemo(() => {
    if (!q) return cantones;
    return cantones.filter(
      (row) =>
        row.canton.toLowerCase().includes(q) ||
        row.provincia.toLowerCase().includes(q),
    );
  }, [cantones, q]);

  const distritosFiltrados = useMemo(() => {
    if (!q) return distritos;
    return distritos.filter(
      (d) =>
        d.distrito.toLowerCase().includes(q) ||
        d.canton.toLowerCase().includes(q) ||
        d.provincia.toLowerCase().includes(q),
    );
  }, [distritos, q]);

  const maxCanton = cantonesFiltrados[0]?.electores ?? 1;

  return (
    <section className="tse-explorador-section">
      <div className="oij-search-heading">
        <div>
          <span className="landing-eyebrow">
            EXPLORADOR AGREGADO
          </span>
          <h2>Busca dentro del territorio electoral</h2>
        </div>

        <p>
          Consulta la distribución del padrón por cantón y busca dentro de
          los distritos electorales. Trabaja con datos agregados, nunca con
          personas individuales.
        </p>
      </div>

      {loading && (
        <div className="oij-chart-state">
          Cargando explorador del padrón...
        </div>
      )}

      {!stats && !loading && null}

      {!loading && stats && (
        <div className="tse-explorador-panel">
          <div className="tse-explorador-toolbar">
            <div className="tse-tabs" role="tablist">
              <button
                className={tab === 'cantones' ? 'active' : ''}
                onClick={() => setTab('cantones')}
                type="button"
                role="tab"
                aria-selected={tab === 'cantones'}
              >
                <Users size={15} />
                Por cantón
              </button>
              <button
                className={tab === 'distritos' ? 'active' : ''}
                onClick={() => setTab('distritos')}
                type="button"
                role="tab"
                aria-selected={tab === 'distritos'}
              >
                <Landmark size={15} />
                Distritos electorales
              </button>
            </div>

            <div className="tse-search-input">
              <Search size={17} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  tab === 'cantones'
                    ? 'Ej: San José, Liberia, Nicoya...'
                    : 'Ej: Hospital, Catedral, Cañas...'
                }
              />
            </div>
          </div>

          {tab === 'cantones' && (
            <div className="tse-table">
              <div className="tse-table-header tse-cantones-header">
                <span>Provincia</span>
                <span>Cantón</span>
                <span>Electores</span>
              </div>

              <div className="tse-table-body">
                {cantonesFiltrados.length === 0 && (
                  <div className="tse-empty">
                    No hay cantones que coincidan con "{query.trim()}".
                  </div>
                )}

                {cantonesFiltrados.slice(0, MAX_ROWS).map((row) => (
                  <div className="tse-table-row" key={`${row.provincia}|${row.canton}`}>
                    <span className="tse-table-provincia">
                      <MapPinned size={13} />
                      {row.provincia}
                    </span>
                    <span className="tse-table-canton">
                      {row.canton}
                      <i>
                        <b
                          style={{
                            width: `${Math.max(
                              (row.electores / maxCanton) * 100,
                              1,
                            )}%`,
                          }}
                        />
                      </i>
                    </span>
                    <strong className="tse-table-electores">
                      {row.electores.toLocaleString('es-CR')}
                    </strong>
                  </div>
                ))}
              </div>

              {cantonesFiltrados.length > MAX_ROWS && (
                <div className="tse-table-footer">
                  Mostrando {MAX_ROWS} de {cantonesFiltrados.length} cantones.
                </div>
              )}
            </div>
          )}

          {tab === 'distritos' && (
            <div className="tse-table">
              <div className="tse-table-header">
                <span>Código</span>
                <span>Provincia</span>
                <span>Cantón</span>
                <span>Distrito electoral</span>
              </div>

              <div className="tse-table-body">
                {distritoError && (
                  <div className="oij-search-state error">
                    <div className="oij-search-state-icon">
                      <Search size={22} />
                    </div>
                    <p>{distritoError}</p>
                  </div>
                )}

                {!distritoError && distritosFiltrados.length === 0 && (
                  <div className="tse-empty">
                    No hay distritos que coincidan con "{query.trim()}".
                  </div>
                )}

                {!distritoError &&
                  distritosFiltrados.slice(0, MAX_ROWS).map((d) => (
                    <div className="tse-table-row tse-distrito-row" key={d.codigo}>
                      <span className="tse-table-codigo">{d.codigo}</span>
                      <span>{d.provincia}</span>
                      <span>{d.canton}</span>
                      <span className="tse-table-distrito">{d.distrito}</span>
                    </div>
                  ))}
              </div>

              {distritosFiltrados.length > MAX_ROWS && (
                <div className="tse-table-footer">
                  Mostrando {MAX_ROWS} de {distritosFiltrados.length} distritos.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TseExplorador;