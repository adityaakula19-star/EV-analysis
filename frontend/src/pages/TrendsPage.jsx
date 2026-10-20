import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import ChartCard from '../components/ChartCard';
import ErrorAlert from '../components/ErrorAlert';
import { ChartSkeleton } from '../components/LoadingSkeleton';

const COUNTRIES = ['All', 'China', 'Germany', 'India', 'Norway', 'UK', 'USA'];
const COUNTRY_COLORS = {
  China: '#10b981',
  Germany: '#06b6d4',
  India: '#f59e0b',
  Norway: '#6366f1',
  UK: '#ec4899',
  USA: '#8b5cf6',
};

export default function TrendsPage() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [dateRange, setDateRange] = useState('All'); // 'All', '2024', '2025', '2026'

  useEffect(() => {
    const fetchMonthly = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getCountryTrends('monthly');
        setMonthlyData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMonthly();
  }, []);

  // Filter by Date Range
  const filteredByDate = useMemo(() => {
    if (!monthlyData) return [];
    if (dateRange === 'All') return monthlyData;
    return monthlyData.filter((item) => item.date.startsWith(dateRange));
  }, [monthlyData, dateRange]);

  // Transform data for Multi-Country Charts
  // Dates: sorted unique dates
  const uniqueDates = useMemo(() => {
    const set = new Set(filteredByDate.map((d) => d.date));
    return Array.from(set).sort();
  }, [filteredByDate]);

  // 1. EV Sales Over Time by Country
  const salesTimeSeries = useMemo(() => {
    return uniqueDates.map((d) => {
      const row = { date: d.substring(0, 7) }; // YYYY-MM
      COUNTRIES.slice(1).forEach((country) => {
        const item = filteredByDate.find((x) => x.date === d && x.country === country);
        row[country] = item ? item.ev_units_sold : 0;
      });
      return row;
    });
  }, [uniqueDates, filteredByDate]);

  // 2. EV Penetration % Over Time by Country
  const penetrationTimeSeries = useMemo(() => {
    return uniqueDates.map((d) => {
      const row = { date: d.substring(0, 7) };
      COUNTRIES.slice(1).forEach((country) => {
        const item = filteredByDate.find((x) => x.date === d && x.country === country);
        row[country] = item ? item.ev_penetration_pct : 0;
      });
      return row;
    });
  }, [uniqueDates, filteredByDate]);

  // 3. Charging Stations Over Time
  const chargingTimeSeries = useMemo(() => {
    return uniqueDates.map((d) => {
      const row = { date: d.substring(0, 7) };
      COUNTRIES.slice(1).forEach((country) => {
        const item = filteredByDate.find((x) => x.date === d && x.country === country);
        row[country] = item ? item.charging_stations_cumulative : 0;
      });
      return row;
    });
  }, [uniqueDates, filteredByDate]);

  // 4. Average EV Price Over Time (USD)
  const priceTimeSeries = useMemo(() => {
    return uniqueDates.map((d) => {
      const row = { date: d.substring(0, 7) };
      COUNTRIES.slice(1).forEach((country) => {
        const item = filteredByDate.find((x) => x.date === d && x.country === country);
        row[country] = item ? Math.round(item.avg_ev_price_usd) : 0;
      });
      return row;
    });
  }, [uniqueDates, filteredByDate]);

  // Determine countries to render (All or single selected)
  const activeCountries = selectedCountry === 'All' ? COUNTRIES.slice(1) : [selectedCountry];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 2rem' }}>
        <ChartSkeleton height="360px" />
        <ChartSkeleton height="360px" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Controls Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Country Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Country View
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="select-input"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All 6 Countries' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Year Range */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Date Range (Jan 2024 – Aug 2026)
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['All', '2024', '2025', '2026'].map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={dateRange === r ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  {r === 'All' ? 'Full Span' : r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Showing <strong>{uniqueDates.length} Monthly Observations</strong> (January 2024 → August 2026)
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* 4 Interactive Time Series Charts */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* 1. EV Sales Over Time */}
        <ChartCard
          title="1. Monthly EV Sales Over Time (January 2024 → August 2026)"
          subtitle="Monthly unit sales trajectory illustrating market ramp-up and seasonal dynamics"
          badge="Units Sold"
        >
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={salesTimeSeries} margin={{ top: 10, right: 25, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickFormatter={(val) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name) => [`${Number(val).toLocaleString()} units`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {activeCountries.map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COUNTRY_COLORS[c]}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. EV Penetration % Over Time */}
        <ChartCard
          title="2. Monthly EV Penetration Rate Over Time (%)"
          subtitle="Share of electric vehicles in total new monthly vehicle registrations"
          badge="Market Share"
        >
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={penetrationTimeSeries} margin={{ top: 10, right: 25, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name) => [`${val}%`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {activeCountries.map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COUNTRY_COLORS[c]}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Charging Infrastructure Over Time */}
        <ChartCard
          title="3. Cumulative Charging Stations Over Time"
          subtitle="Infrastructure rollout velocity across selected territories"
          badge="Infrastructure"
        >
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={chargingTimeSeries} margin={{ top: 10, right: 25, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => val.toLocaleString()} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name) => [`${Number(val).toLocaleString()} stations`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {activeCountries.map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COUNTRY_COLORS[c]}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Average EV Price Over Time */}
        <ChartCard
          title="4. Average EV Price Over Time (USD)"
          subtitle="Price parity trendlines and affordability progression"
          badge="Price Parity"
        >
          <ResponsiveContainer width="100%" height={290}>
            <LineChart data={priceTimeSeries} margin={{ top: 10, right: 25, left: 15, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name) => [`$${Number(val).toLocaleString()}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              {activeCountries.map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COUNTRY_COLORS[c]}
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </section>

    </div>
  );
}
