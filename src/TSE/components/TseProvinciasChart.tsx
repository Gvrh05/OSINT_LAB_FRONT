import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPinned } from 'lucide-react';

import type { TseProvinciaStat, TseStats } from '../types/tse.types';

interface TseProvinciasChartProps {
  stats: TseStats | null;
  loading?: boolean;
}

const COLORS = [
  '#38bdf8',
  '#818cf8',
  '#2dd4bf',
  '#f59e0b',
  '#fb7185',
  '#a78bfa',
  '#22c55e',
];

const TseProvinciasChart = ({
  stats,
  loading = false,
}: TseProvinciasChartProps) => {
  const [open, setOpen] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="tse-chart-section">
        <div className="oij-chart-state">
          Generando estadísticas por provincia...
        </div>
      </section>
    );
  }

  if (!stats || stats.porProvincia.length === 0) {
    return null;
  }

  const maxElectores = Math.max(
    ...stats.porProvincia.map((item) => item.electores),
    1,
  );

  return (
    <section className="tse-chart-section">
      <div className="oij-analytics-heading">
        <div>
          <span className="landing-eyebrow">
            DISTRIBUCIÓN TERRITORIAL
          </span>
          <h2>Electores por provincia</h2>
          <p>
            Electores inscritos en cada provincia y en el extranjero. Haz clic
            en una provincia para ver el desglose por cantón.
          </p>
        </div>

        <span className="oij-chart-total tse-chart-total">
          <span>PADRÓN NACIONAL</span>
          <strong>
            {stats.total.toLocaleString('es-CR')}
          </strong>
        </span>
      </div>

      <div className="tse-provincias">
        {stats.porProvincia.map((provincia: TseProvinciaStat, index) => {
          const isOpen = open === provincia.provincia;
          const pct = Math.max(
            (provincia.electores / maxElectores) * 100,
            1,
          );

          return (
            <article
              className={`tse-provincia-card ${isOpen ? 'expanded' : ''}`}
              key={provincia.provincia}
            >
              <button
                className="tse-provincia-header"
                onClick={() =>
                  setOpen(isOpen ? null : provincia.provincia)
                }
                type="button"
                aria-expanded={isOpen}
              >
                <span className="tse-provincia-name">
                  <MapPinned size={15} />
                  {provincia.provincia}
                </span>

                <span className="tse-provincia-track">
                  <i
                    style={{
                      width: `${pct}%`,
                      background: COLORS[index % COLORS.length],
                    }}
                  />
                </span>

                <span className="tse-provincia-metric">
                  <strong>
                    {provincia.electores.toLocaleString('es-CR')}
                  </strong>
                  <small>{provincia.porcentaje}%</small>
                </span>

                <span className="tse-provincia-toggle">
                  {isOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="tse-provincia-body">
                  <p className="tse-provincia-note">
                    Cantones de {provincia.provincia} ordenados por número de
                    electores.
                  </p>

                  <div className="tse-cantones-list">
                    {provincia.cantones.map((canton) => (
                      <div className="tse-canton-row" key={canton.canton}>
                        <span>{canton.canton}</span>

                        <div className="tse-canton-track">
                          <i
                            style={{
                              width: `${Math.max(
                                (canton.electores /
                                  (provincia.cantones[0]?.electores || 1)) *
                                  100,
                                1,
                              )}%`,
                              background:
                                COLORS[index % COLORS.length],
                            }}
                          />
                        </div>

                        <strong>
                          {canton.electores.toLocaleString('es-CR')}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default TseProvinciasChart;