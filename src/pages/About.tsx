import { Database, Search, ShieldCheck } from 'lucide-react';

const About = () => (
  <div className="page about-page">
    <header className="page-heading internal-heading about-heading">
      <div className="internal-heading-copy">
        <span className="section-eyebrow">PROYECTO ACADÉMICO</span>
        <h1>Información pública, mejor organizada.</h1>
        <p>OSINT CR reúne fuentes oficiales y presenta sus datos mediante una interfaz común, comprensible y verificable.</p>
      </div>
      <div className="about-mark"><ShieldCheck size={36} /><span>Consulta responsable</span></div>
    </header>

    <section className="about-principles">
      <article className="info-card"><span className="info-number">01</span><div className="info-card-icon"><Database size={22} /></div><h2>Fuente oficial</h2><p>La información se obtiene desde recursos públicos consumibles por software y siempre conserva su procedencia.</p></article>
      <article className="info-card"><span className="info-number">02</span><div className="info-card-icon"><Search size={22} /></div><h2>Datos procesados</h2><p>El backend descarga, interpreta y normaliza cada conjunto antes de exponerlo a las búsquedas.</p></article>
      <article className="info-card"><span className="info-number">03</span><div className="info-card-icon"><ShieldCheck size={22} /></div><h2>Uso responsable</h2><p>La plataforma consulta información abierta sin evadir autenticación, permisos ni mecanismos de seguridad.</p></article>
    </section>

    <section className="about-flow">
      <div><span className="section-eyebrow">CÓMO FUNCIONA</span><h2>De la fuente al resultado</h2></div>
      <ol><li><strong>1</strong><span>La institución publica los datos.</span></li><li><strong>2</strong><span>La API los normaliza y filtra.</span></li><li><strong>3</strong><span>El usuario recibe resultados claros.</span></li></ol>
    </section>
  </div>
);

export default About;
