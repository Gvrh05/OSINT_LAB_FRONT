import {
  AlertCircle,
  FileSearch,
  LoaderCircle,
  Search,
} from 'lucide-react';

import OijResultCard from './OijResultCard';

import type {
  OijRecord,
  OijSearchResponse,
} from '../types/oij.types';

interface OijSearchResultsProps {
  data: OijSearchResponse | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  onOpenRecord?: (record: OijRecord) => void;
  onPageChange?: (page: number) => void;
}

const OijSearchResults = ({
  data,
  loading,
  error,
  hasSearched,
  onOpenRecord,
  onPageChange,
}: OijSearchResultsProps) => {
  // Todavía no se ha realizado ninguna búsqueda.
  if (!hasSearched) {
    return (
      <div className="oij-search-state">
        <div className="oij-search-state-icon">
          <Search size={27} />
        </div>

        <h3>Realiza una búsqueda</h3>

        <p>
          Utiliza palabras clave y filtros para consultar los registros
          disponibles en las estadísticas policiales.
        </p>
      </div>
    );
  }

  // La petición está en proceso.
  if (loading) {
    return (
      <div className="oij-search-state">
        <div className="oij-search-state-icon loading">
          <LoaderCircle size={27} />
        </div>

        <h3>Consultando información</h3>

        <p>
          Estamos procesando los datos disponibles de la fuente del OIJ.
        </p>
      </div>
    );
  }

  // Ocurrió un error.
  if (error) {
    return (
      <div className="oij-search-state error">
        <div className="oij-search-state-icon">
          <AlertCircle size={27} />
        </div>

        <h3>No fue posible realizar la consulta</h3>

        <p>{error}</p>
      </div>
    );
  }

  // La búsqueda finalizó pero no hubo coincidencias.
  if (!data || data.results.length === 0) {
    return (
      <div className="oij-search-state">
        <div className="oij-search-state-icon">
          <FileSearch size={27} />
        </div>

        <h3>No se encontraron resultados</h3>

        <p>
          Intenta utilizar otra palabra clave o modificar los filtros de
          búsqueda.
        </p>
      </div>
    );
  }

  // Hay resultados.
  return (
    <div className="oij-search-results">
      <div className="oij-search-results-header">
        <div>
          <span>RESULTADOS ENCONTRADOS</span>

          <h3>
            {data.total.toLocaleString('es-CR')}
            {data.total === 1 ? ' registro' : ' registros'}
          </h3>
        </div>

        {data.query && (
          <div className="oij-current-query">
            Búsqueda:
            <strong> “{data.query}”</strong>
          </div>
        )}
      </div>

      <div className="oij-result-list">
        {data.results.map((record, index) => (
          <OijResultCard
            key={record.id || `oij-result-${index}`}
            record={record}
            onOpen={onOpenRecord}
          />
        ))}
      </div>

      {data.totalPages > 1 && (
        <div className="oij-pagination">
          <button type="button" disabled={data.page <= 1} onClick={() => onPageChange?.(data.page - 1)}>
            Anterior
          </button>
          <span>Página {data.page} de {data.totalPages}</span>
          <button type="button" disabled={data.page >= data.totalPages} onClick={() => onPageChange?.(data.page + 1)}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default OijSearchResults;
