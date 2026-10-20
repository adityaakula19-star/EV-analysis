import React, { useEffect, useState } from 'react';
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
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Zap, PieChart as PieIcon, RefreshCw } from 'lucide-react';

const COUNTRY_COLORS = {
  China: '#10b981',
  Germany: '#06b6d4',
  India: '#f59e0b',
  Norway: '#6366f1',
  UK: '#ec4899',
  USA: '#8b5cf6'
};

const CATEGORY_COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'];

export default function EDADashboard() {
  const [trends, setTrends] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTrends, resCorrs, resCats] = await Promise.all([
        fetch('/api/analytics/country-trends'),
        fetch('/api/analytics/correlations'),
        fetch('/api/analytics/categories')
      ]);

      const dataTrends = await resTrends.json();
      const dataCorrs = await resCorrs.json();
      const dataCats = await resCats.json();

      setTrends(dataTrends);
      setCorrelations(dataCorrs);
      setCategories(dataCats);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Transform trends for 2024-2026 Comparison Chart
  const getYearlyPenetrationData = () => {
    if (!trends) return [];
    const years = [2024, 2025, 2026];
    return years.map(yr => {
      const row = { year: yr };
      Object.keys(trends).forEach(c => {
        const yrData = trends[c].find(item => item.year === yr);
        if (yrData) {
          row[c] = yrData.ev_penetration_pct;
        }
      });
      return row;
    });
  };

  // Transform trends for Sales Volume comparison
  const getSalesVolumeData = () => {
    if (!trends) return [];
    const years = [2024, 2025, 2026];
    return years.map(yr => {
      const row = { year: yr };
      Object.keys(trends).forEach(c => {
        const yrData = trends[c].find(item => item.year === yr);
        if (yrData) {
          row[c] = yrData.ev_units_sold;
        }
      });
      return row;
    });
  };

  // Charging vs Penetration Scatter/Points
  const getChargingVsPenetrationData = () => {
    if (!trends) return [];
    const points = [];
    Object.keys(trends).forEach(c => {
      trends[c].forEach(item => {
        points.push({
          country: c,
          year: item.year,
          charging: item.charging_stations_cumulative,
          penetration: item.ev_penetration_pct,
          sales: item.ev_units_sold,
          price: item.avg_ev_price_usd
        });
      });
    });
    return points;
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '3rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>Loading EDA Analytics & Dataset Metrics...</p>
      </div>
    );
  }

  const yearlyPenData = getYearlyPenetrationData();
  const salesVolData = getSalesVolumeData();
  const scatterData = getChargingVsPenetrationData();

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 color="var(--accent-cyan)" />
            Exploratory Data Analysis <span className="text-gradient-cyan">(10,304 Records)</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Interactive metrics pre-calculated across 6 global markets (2024–2026)
          </p>
        </div>

        <button
          onClick={fetchData}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(15, 23, 42, 0.6)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshCw size={14} /> Refresh Charts
        </button>
      </div>

      {/* Correlation Highlights Bar */}
      {correlations && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Penetration vs. Charging Stations
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              r = {correlations.corr_penetration_vs_charging}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>Strong positive infrastructure impact</p>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Penetration vs. Average EV Price
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
              r = {correlations.corr_penetration_vs_price}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>Affordability sensitivity coefficient</p>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Penetration vs. Active Subsidy
            </span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#818cf8', marginTop: '0.2rem' }}>
              r = {correlations.corr_penetration_vs_subsidy}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>Policy incentive alignment index</p>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '1.5rem' }}>
        
        {/* Chart 1: Market Share Penetration % */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="#34d399" />
            EV Market Share Penetration Rate % (2024–2026)
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyPenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
                />
                <Legend />
                {Object.keys(COUNTRY_COLORS).map(c => (
                  <Bar key={c} dataKey={c} fill={COUNTRY_COLORS[c]} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: EV Units Sold Volume */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} color="#38bdf8" />
            Total EV Units Sold Volume (Annualized)
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesVolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip
                  formatter={(value) => value.toLocaleString() + ' units'}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
                />
                <Legend />
                {Object.keys(COUNTRY_COLORS).map(c => (
                  <Line key={c} type="monotone" dataKey={c} stroke={COUNTRY_COLORS[c]} strokeWidth={3} dot={{ r: 5 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Vehicle Category Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieIcon size={18} color="#818cf8" />
            EV Vehicle Category Breakdown (Global Aggregate)
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="ev_units_sold"
                  nameKey="vehicle_category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={4}
                  label={({ vehicle_category, ev_penetration_pct }) => `${vehicle_category} (${ev_penetration_pct}%)`}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => value.toLocaleString() + ' EV sales'}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Infrastructure vs Penetration Correlation */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={18} color="#f59e0b" />
            Charging Infrastructure vs. Penetration %
          </h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="charging" name="Cumulative Charging Stations" stroke="var(--text-muted)" />
                <YAxis dataKey="penetration" name="Penetration Rate %" stroke="var(--text-muted)" unit="%" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 700, color: '#38bdf8' }}>{d.country} ({d.year})</div>
                        <div>Penetration: {d.penetration}%</div>
                        <div>Charging Stations: {d.charging.toLocaleString()}</div>
                        <div>Avg Price: ${d.price.toLocaleString()}</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="Country Years" data={scatterData} fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
