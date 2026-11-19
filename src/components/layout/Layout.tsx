import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="site-layout">
      <Header />

      <main className="site-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div>
            <strong>OSINT CR</strong>
            <p>Plataforma académica de datos públicos de Costa Rica.</p>
          </div>

          <div className="footer-source">
            Datos abiertos · Costa Rica
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
