import { useEffect, useState } from 'react';
import {
  CalendarDays,
  ExternalLink,
  Landmark,
  MapPin,
  RefreshCw,
} from 'lucide-react';

import TseStats from '../components/TseStats';
import TseProvinciasChart from '../components/TseProvinciasChart';
import TseExplorador from '../components/TseExplorador';

import {
  getTseStats,
  getTseStatus,
} from '../services/tse.service';

import type {
  TseStats as TseStatsData,
  TseStatus,
} from '../types/tse.types';

const TSE_FUENTE_URL =
  'https://www.tse.go.cr/descarga_padron.html';

const formatFecha = (iso?: string | null): string => {
  if (!iso) return 'No disponible';
  try {
    return new Date(iso).toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'No disponible';
  }
};

const TsePage = () => {
  const [status, setStatus] = useState<TseStatus | null>(null);
  const [stats, setStats] = useState<TseStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPadron = async () => {
    try {
      setLoadingDetail(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}/tse/download`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
        },
      );

      if (!response.ok) {
        throw new Error(
          'No fue posible cargar el padrón desde el servidor del TSE.',
        );
      }

      await refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No fue posible cargar el padrón.',
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const refresh = async () => {
    setError(null);
    setLoading(true);

    try {
      const [statusData, statsData] = await Promise.all([
        getTseStatus(),
        getTseStats(),
      ]);
      setStatus(statusData);
      setStats(statsData);
    } catch (err) {
      setStatus(null);
      setStats(null);
      setError(
        err instanceof Error ? err.message : 'No fue posible consultar el TSE.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="tse-page">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="tse-hero">
        <div className="landing-container">
          <div className="oij-hero-grid tse-hero-grid">
            <div className="oij-hero-content">
              <div className="oij-source-label">
                <Landmark size={15} />
                Fuente OSINT activa
              </div>

              <span className="landing-eyebrow">
                TRIBUNAL SUPREMO DE ELECCIONES
              </span>

              <h1>
                Padrón Nacional
                <span> Electoral</span>
              </h1>

              <p>
                Estadísticas territoriales del padrón electoral costarricense:
                electores por provincia, cantón y distrito, publicadas por el
                TSE.
              </p>

              <div className="oij-source-meta">
                <div>
                  <CalendarDays size={17} />

                  <div>
                    <span>Obtención</span>
                    <strong>{formatFecha(status?.metadata?.fechaDescarga)}</strong>
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

              <h3>Tribunal Supremo de Elecciones</h3>

              <p>
                La plataforma procesa el padrón publicado por el TSE para
                ofrecer una vista agregada y territorial de sus datos.
              </p>

              <div className="oij-source-status">
                <span></span>
                Fuente pública
              </div>

              <a href={TSE_FUENTE_URL} target="_blank" rel="noreferrer">
                Consultar fuente oficial
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          ESTADO DEL PADRÓN
      ================================================== */}

      {error && (
        <section className="tse-error-section">
          <div className="landing-container">
            <div className="oij-search-state error">
              <div className="oij-search-state-icon">
                <RefreshCw size={22} />
              </div>
              <h3>El padrón aún no está disponible</h3>
              <p>{error}</p>
              <button
                className={`oij-search-button tse-error-button ${loadingDetail ? 'disabled' : ''}`}
                onClick={() => void loadPadron()}
                disabled={loadingDetail}
                type="button"
              >
                {loadingDetail ? 'Cargando padrón...' : 'Cargar padrón del TSE'}
              </button>
            </div>
          </div>
        </section>
      )}

      {!error && !loading && (!status || !status.cargado) && (
        <section className="tse-error-section">
          <div className="landing-container">
            <div className="oij-search-state">
              <div className="oij-search-state-icon">
                <RefreshCw size={22} />
              </div>
              <h3>El padrón no está cargado</h3>
              <p>
                Para mostrar las estadísticas es necesario descargar el padrón
                desde el servidor del TSE (~78 MB). Este proceso puede tomar
                algunos minutos.
              </p>
              <button
                className={`oij-search-button tse-error-button ${loadingDetail ? 'disabled' : ''}`}
                onClick={() => void loadPadron()}
                disabled={loadingDetail}
                type="button"
              >
                {loadingDetail ? 'Cargando padrón...' : 'Cargar padrón del TSE'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          KPIs
      ================================================== */}

      <section className="oij-overview-section">
        <div className="landing-container">
          <TseStats status={status} loading={loading && !error} />
        </div>
      </section>

      {/* ==================================================
          DISTRIBUCIÓN POR PROVINCIA
      ================================================== */}

      <section className="oij-overview-section">
        <div className="landing-container">
          <TseProvinciasChart stats={stats} loading={loading && !error} />
        </div>
      </section>

      {/* ==================================================
          EXPLORADOR AGREGADO
      ================================================== */}

      <section className="oij-search-section">
        <div className="landing-container">
          <TseExplorador stats={stats} loading={loading && !error} />
        </div>
      </section>

      {/* ==================================================
          PROCEDENCIA
      ================================================== */}

      <section className="tse-provenance-section">
        <div className="landing-container">
          <div className="tse-provenance">
            <strong>Procedencia de los datos</strong>
            <div>
              Fuente: Padrón Nacional Electoral del TSE —{' '}
              {status?.metadata?.fuente ?? 'tse.go.cr'}
            </div>
            <div>Obtenido: {formatFecha(status?.metadata?.fechaDescarga)}</div>
            <div className="tse-responsible">
              Este módulo trabaja únicamente con agregados territoriales. No
              se realizan búsquedas de personas individuales.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TsePage;