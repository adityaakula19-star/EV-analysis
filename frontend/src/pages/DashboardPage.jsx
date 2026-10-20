import React, { useState, useMemo } from 'react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Zap,
  Percent,
  BatteryCharging,
  DollarSign,
  Globe2,
  Car,
  ArrowUpRight,
} from 'lucide-react';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';
import { KPISkeleton, ChartSkeleton } from '../components/LoadingSkeleton';

const COUNTRY_COLORS = {
  China: '#10b981',
  Germany: '#06b6d4',
  India: '#f59e0b',
  Norway: '#6366f1',
  UK: '#ec4899',
  USA: '#8b5cf6',
};

const CATEGORY_COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export default function DashboardPage({ overviewStats, countryTrends, categoriesData, loading, onNavigate }) {
  const [selectedYear, setSelectedYear] = useState('2025');

  // 1. Adoption by Country (for selected year)
  const adoptionByCountry = useMemo(() => {
    if (!countryTrends) return [];
    return Object.entries(countryTrends).map(([country, years]) => {
      const yrData = years.find((y) => String(y.year) === selectedYear) || years[years.length - 1];
      return {
        country,
        ev_sales: yrData?.ev_units_sold || 0,
        penetration: yrData?.ev_penetration_pct || 0,
        charging: yrData?.charging_stations_cumulative || 0,
        price: yrData?.avg_ev_price_usd || 0,
      };
    }).sort((a, b) => b.ev_sales - a.ev_sales);
  }, [countryTrends, selectedYear]);

  // 2. Penetration by Country (sorted by penetration)
  const penetrationByCountry = useMemo(() => {
    return [...adoptionByCountry].sort((a, b) => b.penetration - a.penetration);
  }, [adoptionByCountry]);

  // 3. EV Adoption Over Time (2024 to 2026 for all 6 countries)
  const timeSeriesAdoption = useMemo(() => {
    if (!countryTrends) return [];
    const years = [2024, 2025, 2026];
    return years.map((yr) => {
      const row = { year: String(yr) };
      Object.entries(countryTrends).forEach(([country, yList]) => {
        const item = yList.find((y) => y.year === yr);
        row[country] = item?.ev_units_sold || 0;
      });
      return row;
    });
  }, [countryTrends]);

  // 4. Vehicle Category Distribution (from categoriesData)
  const categoryDistribution = useMemo(() => {
    if (!categoriesData || categoriesData.length === 0) return [];
    return categoriesData.map((c) => ({
      name: c.vehicle_category,
      value: c.ev_units_sold,
      penetration: c.ev_penetration_pct,
      avg_price: c.avg_ev_price_usd,
    }));
  }, [categoriesData]);

  // 5. Charging Infrastructure (sorted)
  const chargingByCountry = useMemo(() => {
    return [...adoptionByCountry].sort((a, b) => b.charging - a.charging);
  }, [adoptionByCountry]);

  // 6. Average Price by Country (sorted)
  const priceByCountry = useMemo(() => {
    return [...adoptionByCountry].sort((a, b) => b.price - a.price);
  }, [adoptionByCountry]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
        <div className="kpi-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <KPISkeleton key={i} />
          ))}
        </div>
        <div className="charts-grid-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '1.5rem 2rem' }}>
      
      {/* KPI Cards Row (All 6 from backend) */}
      <section>
        <div className="kpi-grid">
          <KPICard
            title="Total EV Sales"
            value={overviewStats?.total_ev_sales ? overviewStats.total_ev_sales.toLocaleString() : '13,172,489'}
            subtitle="Cleaned N=10,304 Observations"
            icon={Zap}
            color="emerald"
            badge="Primary"
          />

          <KPICard
            title="Average EV Penetration"
            value={overviewStats?.global_ev_penetration_pct ? `${overviewStats.global_ev_penetration_pct}%` : '27.71%'}
            subtitle="Global Market Share (2024-26)"
            icon={Percent}
            color="cyan"
            badge="Benchmark"
          />

          <KPICard
            title="Total Charging Stations"
            value={overviewStats?.total_charging_stations ? overviewStats.total_charging_stations.toLocaleString() : '25,479'}
            subtitle="Cumulative Infrastructure"
            icon={BatteryCharging}
            color="indigo"
          />

          <KPICard
            title="Average EV Price"
            value={overviewStats?.avg_ev_price_usd ? `$${Math.round(overviewStats.avg_ev_price_usd).toLocaleString()}` : '$16,461'}
            subtitle="Sales-Weighted USD"
            icon={DollarSign}
            color="amber"
          />

          <KPICard
            title="Countries Analyzed"
            value={overviewStats?.total_countries || '6'}
            subtitle="China, DE, IN, NO, UK, US"
            icon={Globe2}
            color="purple"
          />

          <KPICard
            title="Vehicle Categories"
            value={overviewStats?.total_categories || '4'}
            subtitle="2W, 3W, 4W, Electric Bus"
            icon={Car}
            color="rose"
          />
        </div>
      </section>

      {/* Year Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Focus Year:</span>
          {['2024', '2025', '2026'].map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={selectedYear === yr ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
            >
              {yr}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Regional disaggregation represents coursework simulated data • Source: <code>Cleaned_Data</code>
        </div>
      </div>

      {/* 6 Visualizations Grid */}
      <section className="charts-grid-2">
        
        {/* 1. EV Adoption by Country */}
        <ChartCard
          title="1. EV Adoption by Country (Units Sold)"
          subtitle={`Total volume of electric vehicles sold across benchmark markets in ${selectedYear}`}
          badge="Volume"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={adoptionByCountry} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="country" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val) => [`${Number(val).toLocaleString()} units`, 'EV Sales']}
              />
              <Bar dataKey="ev_sales" radius={[6, 6, 0, 0]}>
                {adoptionByCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COUNTRY_COLORS[entry.country] || '#06b6d4'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. EV Penetration by Country */}
        <ChartCard
          title="2. EV Penetration by Country (%)"
          subtitle={`Market share % of electric vehicles in total new vehicle sales in ${selectedYear}`}
          badge="Penetration"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={penetrationByCountry} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="country" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val) => [`${val}%`, 'EV Penetration']}
              />
              <Bar dataKey="penetration" radius={[6, 6, 0, 0]}>
                {penetrationByCountry.map((entry, index) => (
                  <Cell key={`cell-pen-${index}`} fill={COUNTRY_COLORS[entry.country] || '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. EV Adoption Over Time */}
        <ChartCard
          title="3. EV Adoption Over Time (2024–2026)"
          subtitle="Longitudinal progression of annual EV unit sales across all 6 countries"
          badge="Time Series"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timeSeriesAdoption} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickFormatter={(val) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : `${(val / 1000).toFixed(0)}k`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name) => [`${Number(val).toLocaleString()} units`, name]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              {Object.keys(COUNTRY_COLORS).map((c) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={COUNTRY_COLORS[c]}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: COUNTRY_COLORS[c] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Vehicle Category Distribution */}
        <ChartCard
          title="4. Vehicle Category Distribution"
          subtitle="Share of total EV sales volume across 2-Wheelers, 3-Wheelers, 4-Wheelers & Buses"
          badge="Category Share"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val, name, props) => [
                  `${Number(val).toLocaleString()} units (${props.payload.penetration}% pen)`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Charging Infrastructure Comparison */}
        <ChartCard
          title="5. Charging Infrastructure Comparison"
          subtitle={`Cumulative recorded public and semi-public charging stations in ${selectedYear}`}
          badge="Infrastructure"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chargingByCountry} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="country" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => val.toLocaleString()} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val) => [`${Number(val).toLocaleString()} stations`, 'Charging Stations']}
              />
              <Bar dataKey="charging" radius={[6, 6, 0, 0]} fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Average EV Price Comparison */}
        <ChartCard
          title="6. Average EV Price Comparison (USD)"
          subtitle={`Sales-weighted average electric vehicle price across analyzed markets in ${selectedYear}`}
          badge="Affordability"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priceByCountry} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="country" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(10, 15, 28, 0.95)', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                formatter={(val) => [`$${Math.round(val).toLocaleString()}`, 'Avg EV Price']}
              />
              <Bar dataKey="price" radius={[6, 6, 0, 0]} fill="#fbbf24" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </section>

      {/* Quick Action Navigation Card */}
      <section
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          borderColor: 'rgba(6, 182, 212, 0.3)',
        }}
      >
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
            Ready to explore cross-country differences or query the research literature?
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Compare any two countries head-to-head or ask questions grounded in 15 peer-reviewed papers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => onNavigate('comparison')} className="btn btn-secondary">
            <span>Compare Countries</span>
            <ArrowUpRight size={14} />
          </button>
          <button onClick={() => onNavigate('assistant')} className="btn btn-primary">
            <span>Open AI Assistant</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

    </div>
  );
}
