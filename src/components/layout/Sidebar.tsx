import {
  House,
  Database,
  Search,
  ShieldCheck,
  Info,
  Landmark,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h1>OSINT CR</h1>
          <span>Datos públicos</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section">PLATAFORMA</span>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <House size={19} />
          <span>Inicio</span>
        </NavLink>

        <NavLink
          to="/buscar"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <Search size={19} />
          <span>Buscar</span>
        </NavLink>

        <NavLink
          to="/fuentes"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <Database size={19} />
          <span>Fuentes</span>
        </NavLink>

        <span className="sidebar-section sources-title">FUENTES OSINT</span>

        <NavLink
          to="/oij"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <ShieldCheck size={19} />
          <span>OIJ</span>

          <span className="source-status active-status">Activo</span>
        </NavLink>

        <div className="sidebar-link disabled">
          <Landmark size={19} />
          <span>Fuente 2</span>

          <span className="source-status">Próximamente</span>
        </div>

        <div className="sidebar-link disabled">
          <Database size={19} />
          <span>Fuente 3</span>

          <span className="source-status">Próximamente</span>
        </div>

        <span className="sidebar-section sources-title">INFORMACIÓN</span>

        <NavLink
          to="/acerca"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <Info size={19} />
          <span>Acerca del proyecto</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>

        <div>
          <strong>Sistema operativo</strong>
          <span>Fuentes públicas de Costa Rica</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;