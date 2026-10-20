/**
 * Centralized API service for EV Adoption Intelligence System.
 * Connects directly to the FastAPI backend (via Vite proxy or direct base URL).
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const BACKEND_UNAVAILABLE_MSG = 'Backend unavailable. Please start the FastAPI server at http://localhost:8000.';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // response wasn't JSON
    }
    throw new Error(errorDetail);
  }
  return response.json();
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 30000);

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(timeoutId);
    return await handleResponse(res);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('API request timed out after 30 seconds.');
    }
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('Load failed'))) {
      throw new Error(BACKEND_UNAVAILABLE_MSG);
    }
    throw err;
  }
}

export const api = {
  // Health & System status
  getHealth: () => request('/api/health'),

  // Analytics Overview (6 KPI metrics)
  getOverview: () => request('/api/analytics/overview'),

  // Country Trends (yearly or monthly)
  getCountryTrends: (granularity = 'yearly') => 
    request(`/api/analytics/country-trends?granularity=${encodeURIComponent(granularity)}`),

  // Statistical Correlations
  getCorrelations: () => request('/api/analytics/correlations'),

  // Vehicle Categories
  getCategories: ({ country, year } = {}) => {
    const params = new URLSearchParams();
    if (country) params.append('country', country);
    if (year) params.append('year', year);
    const qs = params.toString();
    return request(`/api/analytics/categories${qs ? `?${qs}` : ''}`);
  },

  // Dataset Sample (paginated)
  getDatasetSample: ({ page = 1, limit = 50, country, year, vehicleCategory } = {}) => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (country) params.append('country', country);
    if (year) params.append('year', year);
    if (vehicleCategory) params.append('vehicle_category', vehicleCategory);
    return request(`/api/analytics/dataset-sample?${params.toString()}`);
  },

  // Country Head-to-Head Comparison
  getComparison: (countryA, countryB, year = 2025) => {
    const params = new URLSearchParams({
      country_a: countryA,
      country_b: countryB,
      year: year,
    });
    return request(`/api/analytics/compare?${params.toString()}`);
  },

  // Research Metadata (1.x literature review themes + 15 papers)
  getResearch: () => request('/api/analytics/research'),

  // RAG AI Chat Endpoint
  sendChatMessage: (question) =>
    request('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      timeout: 60000,
    }),
};

export default api;
