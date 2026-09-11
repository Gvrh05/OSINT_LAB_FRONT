import { ArrowRight, Database, Landmark, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sources = () => (
  <div className="page sources-page">
    <header className="page-heading internal-heading">
      <div className="internal-heading-copy">
        <span className="section-eyebrow">FUENTES OSINT</span>
        <h1>Datos con procedencia clara.</h1>
        <p>Cada módulo identifica la institución responsable y transforma su información para facilitar la consulta.</p>
      </div>
      <div className="heading-metric"><strong>2</strong><span>fuentes activas</span></div>
    </header>

    <div className="source-grid">
      <Link to="/oij" className="source-card source-card-active">
        <div className="source-card-top"><div className="source-card-icon"><ShieldCheck size={24} /></div><span className="source-card-state active"><i />Activa</span></div>
        <span className="source-institution">PODER JUDICIAL DE COSTA RICA</span>
        <h2>Estadísticas Policiales</h2>
        <p>Registros del OIJ procesados para realizar búsquedas, aplicar filtros y consultar resúmenes.</p>
        <div className="source-tags"><span>CSV oficial</span><span>Actualización 2026</span><span>Cobertura nacional</span></div>
        <div className="source-card-footer">Explorar fuente <ArrowRight size={17} /></div>
      </Link>

      <Link to="/tse" className="source-card source-card-active">
        <div className="source-card-top"><div className="source-card-icon"><Landmark size={24} /></div><span className="source-card-state active"><i />Activa</span></div>
        <span className="source-institution">TRIBUNAL SUPREMO DE ELECCIONES</span>
        <h2>Padrón Nacional Electoral</h2>
        <p>Estadísticas territoriales del padrón: electores por provincia, cantón y distrito electoral.</p>
        <div className="source-tags"><span>ZIP → TXT oficial</span><span>3.76M electores</span><span>Cobertura nacional</span></div>
        <div className="source-card-footer">Explorar fuente <ArrowRight size={17} /></div>
      </Link>

      <article className="source-card source-card-disabled">
        <div className="source-card-top"><div className="source-card-icon"><Database size={24} /></div><span className="source-card-state">Pendiente</span></div>
        <span className="source-institution">PRÓXIMA INTEGRACIÓN</span>
        <h2>Fuente 3</h2>
        <p>Espacio reservado para incorporar otra fuente pública desarrollada por el equipo.</p>
        <div className="source-placeholder">Integración en preparación</div>
      </article>
    </div>
  </div>
);

export default Sources;
