import {
  CalendarDays,
  ChevronRight,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

import type { OijRecord } from '../types/oij.types';

interface OijResultCardProps {
  record: OijRecord;
  onOpen?: (record: OijRecord) => void;
}

const OijResultCard = ({
  record,
  onOpen,
}: OijResultCardProps) => {
  const title =
    record.delito ||
    record.subDelito ||
    record.categoria ||
    'Registro policial';

  const location = [
    record.provincia,
    record.canton,
    record.distrito,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <article className="oij-result-card">

      <div className="oij-result-card-top">

        <div className="oij-result-source">
          <ShieldCheck size={14} />
          <span>OIJ</span>
        </div>

        {record.fecha && (
          <div className="oij-result-date">
            <CalendarDays size={14} />
            {record.fecha}
          </div>
        )}

      </div>

      <div className="oij-result-body">

        <span className="oij-result-label">
          ESTADÍSTICA POLICIAL
        </span>

        <h3>{title}</h3>

        {location && (
          <div className="oij-result-location">
            <MapPin size={15} />
            <span>{location}</span>
          </div>
        )}

        {(record.subDelito || record.modalidad) && (
          <div className="oij-result-detail">
            <span>Subdelito</span>
            <strong>{record.subDelito || record.modalidad}</strong>
          </div>
        )}

        {record.descripcion && (
          <p className="oij-result-description">
            {record.descripcion}
          </p>
        )}

      </div>

      <div className="oij-result-footer">

        <span>
          Fuente: Poder Judicial de Costa Rica
        </span>

        {onOpen && (
          <button
            type="button"
            onClick={() => onOpen(record)}
          >
            Ver registro
            <ChevronRight size={16} />
          </button>
        )}

      </div>

    </article>
  );
};

export default OijResultCard;
