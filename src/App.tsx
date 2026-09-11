import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';


import Home from './pages/Home';
import Sources from './pages/Sources';
import About from './pages/About';
import Search from './pages/Search';
import OijPage from './OIJ/pages/OijPage';
import TsePage from './TSE/pages/TsePage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/buscar" element={<Search />} />

        <Route path="/fuentes" element={<Sources />} />

        <Route path="/oij" element={<OijPage />} />

        <Route path="/tse" element={<TsePage />} />

        <Route path="/acerca" element={<About />} />

        <Route
          path="*"
          element={
            <div className="page">
              <div className="page-heading">
                <span className="section-eyebrow">404</span>
                <h1>Página no encontrada</h1>
                <p>La dirección solicitada no existe.</p>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;