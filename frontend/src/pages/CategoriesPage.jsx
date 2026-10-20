import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Bike,
  Truck,
  Car,
  Bus,
  Layers,
  Filter,
  CheckCircle2,
  Info,
  DollarSign,
  Percent,
} from 'lucide-react';
import api from '../services/api';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import ErrorAlert from '../components/ErrorAlert';
import { TableSkeleton } from '../components/LoadingSkeleton';

const CATEGORY_COLORS = {
  '2-Wheeler': '#06b6d4',
  '3-Wheeler': '#10b981',
  '4-Wheeler': '#f59e0b',
  'Bus': '#8b5cf6',
};

const CATEGORY_ICONS = {
  '2-Wheeler': Bike,
  '3-Wheeler': Truck,
  '4-Wheeler': Car,
  'Bus': Bus,
};

const COUNTRIES = ['All', 'China', 'Germany', 'India', 'Norway', 'UK', 'USA'];
const YEARS = ['All', '2024', '2025', '2026'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCountry !== 'All') params.country = selectedCountry;
      if (selectedYear !== 'All') params.year = Number(selectedYear);

      const data = await api.getCategories(params);
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [selectedCountry, selectedYear]);

  // Aggregate totals
  const totalCategorySales = useMemo(() => {
    return categories.reduce((acc, c) => acc + c.ev_units_sold, 0);
  }, [categories]);

  // Pie chart data
  const pieData = useMemo(() => {
    return categories.map((c) => ({
      name: c.vehicle_category,
      value: c.ev_units_sold,
      share: totalCategorySales > 0 ? ((c.ev_units_sold / totalCategorySales) * 100).toFixed(1) : 0,
      penetration: c.ev_penetration_pct,
      price: c.avg_ev_price_usd,
    }));
  }, [categories, totalCategorySales]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* Filter Header */}
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
          {/* Country Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Country Filter
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="select-input"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Countries (Global)' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Year Filter
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {YEARS.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={selectedYear === yr ? 'btn btn-primary' : 'btn btn-secondary'}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* India Context Highlight Banner */}
        {selectedCountry === 'India' && (
          <div className="badge badge-emerald" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
            ⚡ India Market: High 2W & 3W Electrification Density
          </div>
        )}
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchCategories} />}

      {/* Category Cards (4 Categories) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.vehicle_category] || Car;
          const colorKey = cat.vehicle_category === '2-Wheeler' ? 'cyan' : cat.vehicle_category === '3-Wheeler' ? 'emerald' : cat.vehicle_category === '4-Wheeler' ? 'amber' : 'purple';
          const share = totalCategorySales > 0 ? ((cat.ev_units_sold / totalCategorySales) * 100).toFixed(1) : 0;

          return (
            <KPICard
              key={cat.vehicle_category}
              title={cat.vehicle_category}
              value={cat.ev_units_sold.toLocaleString()}
              subtitle={`${cat.ev_penetration_pct}% Penetration • ${share}% Share`}
              icon={Icon}
              color={colorKey}
              badge={`$${Math.round(cat.avg_ev_price_usd).toLocaleString()}`}
            />
          );
        })}
      </section>

      {/* Visual Analytics Grid */}
      <section className="charts-grid-2">
        {/* Sales by Category Bar Chart */}
        <ChartCard
          title="EV Units Sold by Vehicle Category"
          subtitle={`Total volume distribution for ${selectedCountry === 'All' ? 'all countries' : selectedCountry} (${selectedYear})`}
          badge="Volume"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categories} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="vehicle_category" stroke="var(--text-muted)" fontSize={12} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val) => [`${Number(val).toLocaleString()} units`, 'EV Sales']}
              />
              <Bar dataKey="ev_units_sold" radius={[6, 6, 0, 0]}>
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.vehicle_category] || '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Share Donut Chart */}
        <ChartCard
          title="Vehicle Category Market Share (%)"
          subtitle="Relative contribution to total electric vehicle sales"
          badge="Market Share"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-donut-${index}`} fill={CATEGORY_COLORS[entry.name] || '#06b6d4'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name, props) => [
                  `${Number(val).toLocaleString()} units (${props.payload.share}%)`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      {/* Category Disaggregation Table */}
      <section className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
              Vehicle Category Metrics Summary
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              Deterministic Pandas aggregations from <code>Cleaned_Data</code>
            </p>
          </div>
          <span className="badge badge-indigo">Cleaned N=10,304</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>EV Units Sold</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Vehicle Sales</th>
                <th style={{ padding: '0.75rem 1rem' }}>EV Penetration (%)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Average Price (USD)</th>
                <th style={{ padding: '0.75rem 1rem' }}>Records</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr
                  key={cat.vehicle_category}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: CATEGORY_COLORS[cat.vehicle_category] || '#ffffff' }}>
                    {cat.vehicle_category}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#ffffff', fontWeight: 700 }}>
                    {cat.ev_units_sold.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {cat.total_new_vehicle_sales.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#34d399', fontWeight: 600 }}>
                    {cat.ev_penetration_pct}%
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#fbbf24' }}>
                    ${Math.round(cat.avg_ev_price_usd).toLocaleString()}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>
                    {cat.record_count.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
