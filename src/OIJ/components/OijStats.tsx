import {
  Building2,
  FileText,
  MapPinned,
  ShieldCheck,
} from 'lucide-react';

import type { OijSummary } from '../types/oij.types';

interface OijStatsProps {
  summary: OijSummary | null;
  loading?: boolean;
}

const OijStats = ({
  summary,
  loading = false,
}: OijStatsProps) => {
  if (loading) {
    return (
      <section className="oij-stats-section">
        <div className="oij-stats-loading">
          Cargando resumen de datos...
        </div>
      </section>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <section className="oij-stats-section">
      <div className="oij-stats-heading">
        <div>
          <span className="landing-eyebrow">
            RESUMEN DE LA FUENTE
          </span>

          <h2>
            Una vista general de los datos disponibles
          </h2>
        </div>

        {summary.lastUpdated && (
          <span className="oij-last-updated">
            Última actualización: {summary.lastUpdated}
          </span>
        )}
      </div>

      <div className="oij-stats-grid">

        <article className="oij-stat-item">
          <div className="oij-stat-icon">
            <FileText size={21} />
          </div>

          <div>
            <span className="oij-stat-label">
              REGISTROS
            </span>

            <strong>
              {summary.totalRecords.toLocaleString('es-CR')}
            </strong>

            <p>
              Registros disponibles en la fuente consultada.
            </p>
          </div>
        </article>

        {summary.totalProvinces !== undefined && (
          <article className="oij-stat-item">
            <div className="oij-stat-icon">
              <MapPinned size={21} />
            </div>

            <div>
              <span className="oij-stat-label">
                PROVINCIAS
              </span>

              <strong>
                {summary.totalProvinces}
              </strong>

              <p>
                Provincias representadas dentro del conjunto de datos.
              </p>
            </div>
          </article>
        )}

        {summary.totalCantons !== undefined && (
          <article className="oij-stat-item">
            <div className="oij-stat-icon">
              <Building2 size={21} />
            </div>

            <div>
              <span className="oij-stat-label">
                CANTONES
              </span>

              <strong>
                {summary.totalCantons}
              </strong>

              <p>
                Cantones con información disponible.
              </p>
            </div>
          </article>
        )}

        {summary.mostFrequentCrime && (
          <article className="oij-stat-item oij-stat-highlight">
            <div className="oij-stat-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span className="oij-stat-label">
                CATEGORÍA MÁS FRECUENTE
              </span>

              <strong className="oij-stat-text">
                {summary.mostFrequentCrime}
              </strong>

              <p>
                Categoría con mayor presencia en los datos consultados.
              </p>
            </div>
          </article>
        )}

      </div>
    </section>
  );
};

export default OijStats;