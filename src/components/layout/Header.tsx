import { Database, Menu, ShieldCheck } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header className="website-header">
      <div className="navbar">
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo">
            <ShieldCheck size={21} />
          </div>

          <div>
            <strong>OSINT CR</strong>
            <span>Datos públicos</span>
          </div>
        </NavLink>

        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/fuentes"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Fuentes
          </NavLink>

          <NavLink
            to="/buscar"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Buscar
          </NavLink>

          <NavLink
            to="/zonas"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Zonas
          </NavLink>

          <NavLink
            to="/acerca"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Acerca
          </NavLink>
        </nav>

        <NavLink to="/oij" className="navbar-action">
          <Database size={17} />
          Explorar datos
        </NavLink>

        <button className="navbar-mobile">
          <Menu size={22} />
        </button>
      </div>
    </header>
  );
};

export default Header;
