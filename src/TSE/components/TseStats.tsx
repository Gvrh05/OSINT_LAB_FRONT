import { Building2, CalendarDays, Landmark, Users } from 'lucide-react';

import type { TseStatus } from '../types/tse.types';

interface TseStatsProps {
  status: TseStatus | null;
  loading?: boolean;
}

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

const TseStats = ({ status, loading = false }: TseStatsProps) => {
  if (loading) {
    return (
      <section className="tse-stats-section">
        <div className="oij-stats-loading">
          Cargando datos del padrón electoral...
        </div>
      </section>
    );
  }

  if (!status || !status.cargado) {
    return null;
  }

  return (
    <section className="tse-stats-section">
      <div className="oij-stats-heading">
        <div>
          <span className="landing-eyebrow">RESUMEN DE LA FUENTE</span>
          <h2>El padrón electoral en una mirada</h2>
        </div>

        {status.metadata?.fechaDescarga && (
          <span className="oij-last-updated">
            Obtenido: {formatFecha(status.metadata.fechaDescarga)}
          </span>
        )}
      </div>

      <div className="oij-stats-grid">
        <article className="oij-stat-item">
          <div className="oij-stat-icon">
            <Users size={21} />
          </div>

          <div>
            <span className="oij-stat-label">ELECTORES INSCRITOS</span>
            <strong>
              {status.registros.toLocaleString('es-CR')}
            </strong>
            <p>
              Personas inscritas en el padrón nacional electoral.
            </p>
          </div>
        </article>

        <article className="oij-stat-item">
          <div className="oij-stat-icon">
            <Landmark size={21} />
          </div>

          <div>
            <span className="oij-stat-label">PROVINCIAS</span>
            <strong>7</strong>
            <p>
              Provincias más el voto en el extranjero (consulados).
            </p>
          </div>
        </article>

        <article className="oij-stat-item">
          <div className="oij-stat-icon">
            <Building2 size={21} />
          </div>

          <div>
            <span className="oij-stat-label">DISTRITOS ELECTORALES</span>
            <strong>
              {status.distritosElectorales.toLocaleString('es-CR')}
            </strong>
            <p>
              Divisiones territoriales reconocidas por el TSE.
            </p>
          </div>
        </article>

        <article className="oij-stat-item oij-stat-highlight">
          <div className="oij-stat-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <span className="oij-stat-label">VIGENCIA</span>
            <strong className="oij-stat-text">Padrón vigente</strong>
            <p>
              Datos públicos oficiales del Tribunal Supremo de Elecciones.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
};

export default TseStats;