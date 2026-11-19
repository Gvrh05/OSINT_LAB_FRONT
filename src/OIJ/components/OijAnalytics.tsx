import { useEffect, useMemo, useState } from 'react';
import { BarChart3, ChartPie, RefreshCw } from 'lucide-react';
import { getOijStatistics } from '../services/oij.service';
import type {
  OijFiltersData,
  OijStatisticsGroup,
  OijStatisticsResponse,
} from '../types/oij.types';

const COLORS = ['#38bdf8', '#818cf8', '#2dd4bf', '#f59e0b', '#fb7185', '#a78bfa', '#22c55e', '#f97316'];

const OijAnalytics = ({ filters }: { filters: OijFiltersData | null }) => {
  const [groupBy, setGroupBy] = useState<OijStatisticsGroup>('month');
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [year, setYear] = useState('2026');
  const [province, setProvince] = useState('');
  const [crime, setCrime] = useState('');
  const [data, setData] = useState<OijStatisticsResponse | null>(null);
  const [loadedKey, setLoadedKey] = useState('');
  const [error, setError] = useState('');
  const requestKey = `${groupBy}|${year}|${province}|${crime}`;
  const loading = loadedKey !== requestKey;

  useEffect(() => {
    let active = true;
    getOijStatistics({ groupBy, year, province, crime })
      .then((response) => {
        if (!active) return;
        setData(response);
        setError('');
        setLoadedKey(requestKey);
      })
      .catch(() => {
        if (!active) return;
        setError('No fue posible generar la estadística.');
        setLoadedKey(requestKey);
      });
    return () => { active = false; };
  }, [groupBy, year, province, crime, requestKey]);

  const visibleItems = useMemo(() => {
    if (!data) return [];
    return groupBy === 'crime' ? data.items.slice(0, 10) : data.items;
  }, [data, groupBy]);

  const maxValue = Math.max(...visibleItems.map((item) => item.value), 1);
  const pieTotal = visibleItems.reduce((sum, item) => sum + item.value, 0);
  const pieStops = visibleItems.map((item, index) => {
    const start = visibleItems.slice(0, index).reduce((sum, current) => sum + current.value, 0);
    const end = start + item.value;
    return `${COLORS[index % COLORS.length]} ${(start / pieTotal) * 360}deg ${(end / pieTotal) * 360}deg`;
  });

  return (
    <section className="oij-analytics">
      <div className="oij-analytics-heading">
        <div>
          <span className="landing-eyebrow">ANÁLISIS INTERACTIVO</span>
          <h2>Convierte los registros en estadísticas</h2>
          <p>Selecciona los filtros y compara los datos por año, mes, provincia o delito.</p>
        </div>
        <div className="oij-chart-switch" aria-label="Tipo de gráfico">
          <button className={chartType === 'bar' ? 'active' : ''} onClick={() => setChartType('bar')} type="button"><BarChart3 size={16} /> Barras</button>
          <button className={chartType === 'pie' ? 'active' : ''} onClick={() => setChartType('pie')} type="button"><ChartPie size={16} /> Circular</button>
        </div>
      </div>

      <div className="oij-analytics-panel">
        <div className="oij-analytics-filters">
          <label>Agrupar por<select value={groupBy} onChange={(event) => { const value = event.target.value as OijStatisticsGroup; setGroupBy(value); if (value === 'year') setYear(''); }}><option value="year">Año</option><option value="month">Mes</option><option value="province">Provincia</option><option value="crime">Delito</option></select></label>
          <label>Año<select value={year} disabled={groupBy === 'year'} onChange={(event) => setYear(event.target.value)}><option value="">Todos</option>{(filters?.years ?? [2026, 2025, 2024, 2023]).map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Provincia<select value={province} onChange={(event) => setProvince(event.target.value)}><option value="">Todas</option>{filters?.provinces.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label>Delito<select value={crime} onChange={(event) => setCrime(event.target.value)}><option value="">Todos</option>{filters?.crimes.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </div>

        {loading && <div className="oij-chart-state"><RefreshCw className="spin" size={22} /> Generando estadística…</div>}
        {!loading && error && <div className="oij-chart-state error">{error}</div>}
        {!loading && !error && data && (
          <div className="oij-chart-layout">
            <div className="oij-chart-canvas">
              <div className="oij-chart-total"><span>REGISTROS ANALIZADOS</span><strong>{data.total.toLocaleString('es-CR')}</strong></div>
              {visibleItems.length === 0 ? <div className="oij-chart-state">No existen datos con estos filtros.</div> : chartType === 'bar' ? (
                <div className="oij-bars" role="img" aria-label={`Gráfico de barras con ${visibleItems.length} categorías`}>
                  {visibleItems.map((item, index) => <div className="oij-bar-row" key={item.label}><span title={item.label}>{item.label}</span><div><i style={{ width: `${Math.max((item.value / maxValue) * 100, 1)}%`, background: COLORS[index % COLORS.length] }} /></div><strong>{item.value.toLocaleString('es-CR')}</strong></div>)}
                </div>
              ) : (
                <div className="oij-pie-wrap"><div className="oij-pie" role="img" aria-label={`Gráfico circular con ${visibleItems.length} categorías`} style={{ background: `conic-gradient(${pieStops.join(',')})` }}><div><strong>{data.total.toLocaleString('es-CR')}</strong><span>Total</span></div></div></div>
              )}
            </div>
            <div className="oij-chart-legend">
              <h3>Distribución</h3>
              {visibleItems.map((item, index) => <div key={item.label}><i style={{ background: COLORS[index % COLORS.length] }} /><span title={item.label}>{item.label}</span><strong>{item.percentage.toLocaleString('es-CR')}%</strong></div>)}
              {groupBy === 'crime' && data.items.length > 10 && <p>Se muestran los 10 delitos con más registros.</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OijAnalytics;
