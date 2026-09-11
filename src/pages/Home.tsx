import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react';
import heroImage from '../assets/hero.png';

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const value = query.trim();
    if (value) navigate(`/buscar?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="website-page">
      <section className="landing-hero">
        <div className="landing-container hero-layout">
          <div className="hero-copy">
            <div className="hero-tag"><Sparkles size={14} /> Información pública de Costa Rica</div>
            <h1>Datos abiertos.<span> Información útil.</span></h1>
            <p className="hero-description">
              Busca y explora información pública costarricense desde una experiencia clara y centralizada.
            </p>
            <form className="main-search" onSubmit={handleSearch}>
              <Search size={21} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca un delito, provincia, cantón o término..." />
              <button type="submit">Buscar <ArrowRight size={17} /></button>
            </form>
            <div className="search-examples">
              <span>Prueba buscando:</span>
              <button onClick={() => setQuery('robo')}>Robo</button>
              <button onClick={() => setQuery('Guanacaste')}>Guanacaste</button>
              <button onClick={() => setQuery('Nicoya')}>Nicoya</button>
            </div>
            <div className="hero-links">
              <Link to="/oij" className="hero-primary-link">Explorar OIJ <ArrowRight size={17} /></Link>
              <Link to="/fuentes" className="hero-secondary-link">Ver fuentes</Link>
            </div>
          </div>

          <div className="hero-image-area">
            <div className="image-decoration" />
            <img src={heroImage} alt="Consulta de datos públicos de Costa Rica" className="hero-main-image" />
            <div className="image-floating-card image-card-top">
              <div className="floating-icon"><ShieldCheck size={18} /></div>
              <div><strong>Fuente verificable</strong><span>Poder Judicial de Costa Rica</span></div>
            </div>
            <div className="image-floating-card image-card-bottom">
              <div className="floating-status" />
              <div><strong>OIJ</strong><span>Estadísticas disponibles</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section capabilities-section">
        <div className="landing-container">
          <div className="center-heading">
            <span className="landing-eyebrow">¿QUÉ PUEDES HACER?</span>
            <h2>Consulta los datos sin complicaciones</h2>
            <p>Una búsqueda directa y herramientas sencillas para comprender la información publicada.</p>
          </div>
          <div className="capabilities-grid">
            <article className="capability"><div className="capability-icon"><Search size={23} /></div><h3>Buscar</h3><p>Encuentra registros mediante términos o ubicaciones.</p></article>
            <article className="capability"><div className="capability-icon"><BarChart3 size={23} /></div><h3>Analizar</h3><p>Consulta resúmenes construidos a partir de datos reales.</p></article>
            <article className="capability"><div className="capability-icon"><MapPin size={23} /></div><h3>Filtrar</h3><p>Refina resultados por provincia, cantón, delito y año.</p></article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
