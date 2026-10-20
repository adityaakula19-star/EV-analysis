import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import {
  ArrowUp,
  ArrowDown,
  Minus,
  Zap,
  GitCompare,
} from 'lucide-react';
import api from '../services/api';
import ChartCard from '../components/ChartCard';
import ErrorAlert from '../components/ErrorAlert';

const COUNTRIES = ['China', 'Germany', 'India', 'Norway', 'UK', 'USA'];
const YEARS = [2024, 2025, 2026];

export default function CountryComparisonPage({ countryTrends }) {
  const [countryA, setCountryA] = useState('India');
  const [countryB, setCountryB] = useState('Germany');
  const [year, setYear] = useState(2025);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [compData, setCompData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load comparison data from backend
  const loadComparison = async (cA, cB, yr) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getComparison(cA, cB, yr);
      setCompData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison(countryA, countryB, year);
  }, [countryA, countryB, year]);

  const mA = compData?.country_a;
  const mB = compData?.country_b;

  // Filter category metrics if user selected specific category
  const getCatMetricA = () => {
    if (selectedCategory === 'All' || !mA?.category_breakdown) return null;
    return mA.category_breakdown[selectedCategory];
  };

  const getCatMetricB = () => {
    if (selectedCategory === 'All' || !mB?.category_breakdown) return null;
    return mB.category_breakdown[selectedCategory];
  };

  const catA = getCatMetricA();
  const catB = getCatMetricB();

  const activeSalesA = catA ? catA.ev_sales : mA?.ev_units_sold || 0;
  const activeSalesB = catB ? catB.ev_sales : mB?.ev_units_sold || 0;
  const activePenA = catA ? catA.penetration_pct : mA?.ev_penetration_pct || 0;
  const activePenB = catB ? catB.penetration_pct : mB?.ev_penetration_pct || 0;

  // Side by Side Visual Data
  const comparisonChartData = [
    {
      metric: 'EV Sales (k)',
      [countryA]: Math.round(activeSalesA / 1000),
      [countryB]: Math.round(activeSalesB / 1000),
    },
    {
      metric: 'Penetration (%)',
      [countryA]: activePenA,
      [countryB]: activePenB,
    },
    {
      metric: 'Charging (k)',
      [countryA]: Math.round((mA?.charging_stations_cumulative || 0) / 1000),
      [countryB]: Math.round((mB?.charging_stations_cumulative || 0) / 1000),
    },
    {
      metric: 'Avg Price ($k)',
      [countryA]: Math.round((mA?.avg_ev_price_usd || 0) / 1000),
      [countryB]: Math.round((mB?.avg_ev_price_usd || 0) / 1000),
    },
  ];

  // 3-Year Trend Comparison
  const trendComparisonData = YEARS.map((yr) => {
    const dataA = countryTrends?.[countryA]?.find((y) => y.year === yr);
    const dataB = countryTrends?.[countryB]?.find((y) => y.year === yr);
    return {
      year: String(yr),
      [`${countryA} Sales`]: dataA?.ev_units_sold || 0,
      [`${countryB} Sales`]: dataB?.ev_units_sold || 0,
      [`${countryA} Pen %`]: dataA?.ev_penetration_pct || 0,
      [`${countryB} Pen %`]: dataB?.ev_penetration_pct || 0,
    };
  });

  // Delta Helper
  const renderDelta = (valA, valB, unit = '', isPercentagePoint = false) => {
    const diff = valA - valB;
    const isHigher = diff > 0;
    const isZero = diff === 0;

    let pctChange = '';
    if (valB > 0 && !isPercentagePoint) {
      pctChange = ` (${((diff / valB) * 100).toFixed(1)}%)`;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: isHigher ? '#34d399' : isZero ? 'var(--text-dim)' : '#fda4af',
        }}
      >
        {isHigher ? <ArrowUp size={14} /> : isZero ? <Minus size={14} /> : <ArrowDown size={14} />}
        <span>
          {Math.abs(diff).toLocaleString()} {unit}
          {pctChange}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 400 }}>
          {isHigher ? `${countryA} higher` : isZero ? 'Equal' : `${countryB} higher`}
        </span>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Filter and Selection Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          borderLeft: '4px solid var(--accent-cyan)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Country A */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Country A
            </label>
            <select
              value={countryA}
              onChange={(e) => setCountryA(e.target.value)}
              className="select-input"
              style={{ fontWeight: 600, color: '#38bdf8' }}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c} disabled={c === countryB}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ paddingTop: '1.2rem', color: 'var(--text-dim)', fontWeight: 700 }}>VS</div>

          {/* Country B */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Country B
            </label>
            <select
              value={countryB}
              onChange={(e) => setCountryB(e.target.value)}
              className="select-input"
              style={{ fontWeight: 600, color: '#f59e0b' }}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c} disabled={c === countryA}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Year
            </label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="select-input"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Vehicle Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-input"
            >
              <option value="All">All Categories</option>
              <option value="2-Wheeler">2-Wheeler</option>
              <option value="3-Wheeler">3-Wheeler</option>
              <option value="4-Wheeler">4-Wheeler</option>
              <option value="Bus">Bus</option>
            </select>
          </div>
        </div>

        {/* Quick swap button */}
        <button
          onClick={() => {
            const temp = countryA;
            setCountryA(countryB);
            setCountryB(temp);
          }}
          className="btn btn-secondary"
          style={{ fontSize: '0.8rem' }}
        >
          <GitCompare size={14} />
          <span>Swap Countries</span>
        </button>
      </div>

      {error && <ErrorAlert message={error} onRetry={() => loadComparison(countryA, countryB, year)} />}

      {/* Side-by-Side Comparison Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Country A Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, rgba(13, 20, 36, 0.8) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Target Market A</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>{countryA}</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Calendar Year {year}</span>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Zap size={24} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                EV Sales {selectedCategory !== 'All' ? `(${selectedCategory})` : ''}
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                {activeSalesA.toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                EV Penetration Rate
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>
                {activePenA}%
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Cumulative Charging Stations
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#818cf8' }}>
                {(mA?.charging_stations_cumulative || 0).toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Average EV Price (USD)
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fbbf24' }}>
                ${Math.round(mA?.avg_ev_price_usd || 0).toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Active Subsidy Status
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: mA?.subsidy_active_pct > 50 ? '#34d399' : '#fda4af' }}>
                {mA?.subsidy_active_pct ? `${mA.subsidy_active_pct}% Active Subsidy Coverage` : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        {/* Head-to-Head Delta Summary Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1px solid var(--border-glass)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <GitCompare size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Deterministic Delta
              </h3>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, marginBottom: '1.25rem' }}>
              Calculated using Python/Pandas backend logic. Values show {countryA} relative to {countryB}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Sales Volume Delta</div>
                {renderDelta(activeSalesA, activeSalesB, 'units')}
              </div>

              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Penetration Rate Delta</div>
                {renderDelta(activePenA, activePenB, 'percentage points', true)}
              </div>

              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Charging Infrastructure Delta</div>
                {renderDelta(mA?.charging_stations_cumulative || 0, mB?.charging_stations_cumulative || 0, 'stations')}
              </div>

              <div style={{ padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Average Price Delta (USD)</div>
                {renderDelta(mA?.avg_ev_price_usd || 0, mB?.avg_ev_price_usd || 0, 'USD')}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan-light)', fontWeight: 600 }}>
              Higher Penetration: {activePenA > activePenB ? countryA : countryB} ({Math.max(activePenA, activePenB)}%)
            </span>
          </div>
        </div>

        {/* Country B Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08) 0%, rgba(13, 20, 36, 0.8) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>Target Market B</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>{countryB}</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Calendar Year {year}</span>
            </div>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <Zap size={24} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                EV Sales {selectedCategory !== 'All' ? `(${selectedCategory})` : ''}
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                {activeSalesB.toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                EV Penetration Rate
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>
                {activePenB}%
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Cumulative Charging Stations
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#818cf8' }}>
                {(mB?.charging_stations_cumulative || 0).toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Average EV Price (USD)
              </span>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fbbf24' }}>
                ${Math.round(mB?.avg_ev_price_usd || 0).toLocaleString()}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                Active Subsidy Status
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: mB?.subsidy_active_pct > 50 ? '#34d399' : '#fda4af' }}>
                {mB?.subsidy_active_pct ? `${mB.subsidy_active_pct}% Active Subsidy Coverage` : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Visual Comparison Charts */}
      <section className="charts-grid-2">
        {/* Normalized Head to Head Bar Chart */}
        <ChartCard
          title={`Normalized Metric Comparison (${year})`}
          subtitle={`Side-by-side comparison between ${countryA} and ${countryB}`}
          badge="Direct Scale"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={comparisonChartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="metric" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey={countryA} fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey={countryB} fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3-Year Trend Trajectory */}
        <ChartCard
          title="3-Year Adoption Trajectory (2024–2026)"
          subtitle={`Annual EV sales growth comparison for ${countryA} and ${countryB}`}
          badge="Growth"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendComparisonData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val) => [`${Number(val).toLocaleString()} units`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line type="monotone" dataKey={`${countryA} Sales`} stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey={`${countryB} Sales`} stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

    </div>
  );
}
