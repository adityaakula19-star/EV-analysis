import React, { useState, useEffect } from 'react';
import { Database, Filter, ChevronLeft, ChevronRight, Search, CheckCircle, XCircle } from 'lucide-react';

export default function DatasetExplorer() {
  const [records, setRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let url = `/api/analytics/dataset-sample?page=${page}&limit=25`;
      if (country) url += `&country=${encodeURIComponent(country)}`;
      if (year) url += `&year=${year}`;
      if (category) url += `&vehicle_category=${encodeURIComponent(category)}`;

      const res = await fetch(url);
      const data = await res.json();
      setRecords(data.records || []);
      setTotalRecords(data.total_records || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch dataset sample:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, country, year, category]);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database color="var(--accent-indigo)" />
            Dataset Explorer <span className="text-gradient-cyan">({totalRecords.toLocaleString()} Records)</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
            Inspect raw cleaned EV adoption dataset records across countries, regions, and categories
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Country Filter */}
          <select
            id="filter-country-select"
            value={country}
            onChange={handleFilterChange(setCountry)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="">All Countries</option>
            <option value="China">China</option>
            <option value="Germany">Germany</option>
            <option value="India">India</option>
            <option value="Norway">Norway</option>
            <option value="UK">UK</option>
            <option value="USA">USA</option>
          </select>

          {/* Year Filter */}
          <select
            id="filter-year-select"
            value={year}
            onChange={handleFilterChange(setYear)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="">All Years</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>

          {/* Category Filter */}
          <select
            id="filter-category-select"
            value={category}
            onChange={handleFilterChange(setCategory)}
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="">All Categories</option>
            <option value="2W">2-Wheeler (2W)</option>
            <option value="3W">3-Wheeler (3W)</option>
            <option value="4W">4-Wheeler (4W / Passenger)</option>
            <option value="Bus">Commercial Bus</option>
          </select>
        </div>
      </div>

      {/* Dataset Table Panel */}
      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Date</th>
              <th style={{ padding: '0.75rem 1rem' }}>Country</th>
              <th style={{ padding: '0.75rem 1rem' }}>Region</th>
              <th style={{ padding: '0.75rem 1rem' }}>Category</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total Sales</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>EV Units Sold</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Penetration %</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Charging Stations</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Avg Price (USD)</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Subsidy</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Fetching dataset records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No matching records found for selected filters.
                </td>
              </tr>
            ) : (
              records.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {r.date}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {r.country}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                    {r.region}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {r.vehicle_category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {r.total_new_vehicle_sales?.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: 600 }}>
                    {r.ev_units_sold?.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)', color: '#38bdf8', fontWeight: 600 }}>
                    {r.ev_penetration_pct}%
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {r.charging_stations_cumulative?.toLocaleString()}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    ${r.avg_ev_price_usd?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    {r.subsidy_active ? (
                      <span style={{ color: '#34d399', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <XCircle size={14} /> None
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0.5rem 0.5rem 0.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          marginTop: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing Page {page} of {totalPages} ({totalRecords.toLocaleString()} total records)
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              id="pagination-prev-btn"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: page <= 1 ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.8)',
                color: page <= 1 ? 'var(--text-dim)' : 'var(--text-main)',
                fontSize: '0.8rem',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              id="pagination-next-btn"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: page >= totalPages ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.8)',
                color: page >= totalPages ? 'var(--text-dim)' : 'var(--text-main)',
                fontSize: '0.8rem',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
