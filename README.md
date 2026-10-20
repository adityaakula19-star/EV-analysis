# EV Adoption Intelligence System
**Evidence-Grounded RAG Analytics, Cross-Country Benchmarking, and Deterministic EV Transition Intelligence**

---

## 1. Project Purpose & Overview
The **EV Adoption Intelligence System** is an academic research platform designed to analyze, benchmark, and explain electric vehicle (EV) adoption across international markets, vehicle categories, and longitudinal time horizons.

Traditional EV dashboards either provide static, ungrounded charts or deploy generative LLMs that fabricate numbers and research citations. This system enforces a strict architectural boundary:
- **Numerical & Statistical Analysis:** Executed deterministically using **Python / Pandas**.
- **Research Grounding:** Sourced via **FAISS vector retrieval** over 15 peer-reviewed scientific studies and literature review metadata.
- **LLM Synthesis:** The LLM acts exclusively as an **explanation layer**; it is strictly prohibited from inventing numbers or statistical calculations.

---

## 2. Dataset Specifications
- **Cleaned Observations:** Exactly **10,304 records**
- **Time Horizon:** January 2024 to August 2026 (Monthly frequency)
- **Countries Analyzed (6):**
  - China, Germany, India, Norway, United Kingdom (UK), United States (USA)
- **Vehicle Categories (4):**
  - 2-Wheeler, 3-Wheeler, 4-Wheeler, Electric Bus
- **Primary Variables:**
  - `country`, `region`, `date`, `vehicle_category`, `total_new_vehicle_sales`, `ev_units_sold`, `ev_penetration_pct`, `charging_stations_cumulative`, `avg_ev_price_usd`, `subsidy_active`
- *Note:* Regional disaggregation within countries represents coursework/project simulated data calibrated against empirical national baselines.

---

## 3. System Architecture

```text
               USER INTERFACE (React 19 + Recharts + Vite)
                                    │
                                    ▼
                     FASTAPI BACKEND (:8000)
                     /api/chat | /api/analytics/*
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
   PANDAS ANALYTICS ENGINE                         FAISS VECTOR STORE
 (10,304 Cleaned Observations)                 (15 Peer-Reviewed Papers +
 - EV Sales & Penetration Rates                 Literature Review Metadata)
 - Cross-Country Delos & Rankings              - 384-dim Semantic Hashing
 - Statistical Correlations (Pearson r)        - Top-k Literature Chunk Retrieval
            │                                               │
            └───────────────────────┬───────────────────────┘
                                    ▼
                      LLM EXPLANATION SYNTHESIS
                    (gpt-4o-mini / Offline Mode)
                 [Strict Rule: Zero Arithmetic Allowed]
                                    │
                                    ▼
               EVIDENCE-GROUNDED STRUCTURED RESPONSE
        Direct Answer | Key Findings | Data Evidence | Sources
```

---

## 4. Key Pages & Features

1. **Executive Dashboard:**
   - 6 Live KPI Cards: Total EV Sales (`13,172,489`), Average EV Penetration (`27.71%`), Total Charging Stations (`25,479`), Average EV Price (`$16,461`), Countries (`6`), Categories (`4`).
   - 6 Interactive Recharts: Sales by Country, Penetration by Country, Multi-country 3-Year Time-Series, Category Share Donut, Charging Infrastructure, and Affordability Comparison.
2. **Country Comparison:**
   - Head-to-head comparison between any two markets (e.g. India vs Germany).
   - Side-by-side metric cards with percentage differences, higher/lower delta indicators, and normalized multi-metric bar charts.
3. **Longitudinal Trends (2024–2026):**
   - 32-month high-resolution time series covering EV sales, market share penetration %, cumulative charging stations, and average vehicle price.
4. **Vehicle Categories:**
   - Deep dive into 2-Wheelers, 3-Wheelers, 4-Wheelers, and Buses. Highlights India's distinctive 2W/3W electrification trajectory.
5. **Statistical Factor Analysis:**
   - Analyzes empirical Pearson correlation coefficients: Subsidies vs Penetration (`+0.2060`), Charging vs Sales (`+0.1872`), Charging vs Penetration (`+0.0204`), Price vs Penetration (`-0.0366`).
   - Includes mandatory scientific disclaimer: *Correlation does not imply causation.*
6. **Research Intelligence (RAG):**
   - 5 core literature review themes extracted from `Literature_Review_and_Metadata.docx`.
   - Comprehensive matrix of 15 peer-reviewed scientific studies from `EV_Adoption_Research_Papers_Comparison.xlsx` with pros, cons, and future work.
7. **EV Intelligence Assistant:**
   - Analytical AI research assistant with suggested queries, multi-stage loading animation, and structured card answers.
8. **Methodology & About:**
   - Complete project overview, research gap, innovations, and architectural principles.

---

## 5. API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System status, record count (`10,304`), and LLM configuration |
| `GET` | `/api/analytics/overview` | 6 headline KPI summary metrics |
| `GET` | `/api/analytics/country-trends` | Yearly (`default`) or Monthly (`?granularity=monthly`) trajectories |
| `GET` | `/api/analytics/correlations` | Statistical Pearson correlation coefficients |
| `GET` | `/api/analytics/categories` | Disaggregated category metrics with optional `?country=` and `?year=` |
| `GET` | `/api/analytics/compare` | Head-to-head comparison (`?country_a=India&country_b=Germany&year=2025`) |
| `GET` | `/api/analytics/research` | 5 literature review themes and 15 research papers matrix |
| `GET` | `/api/analytics/dataset-sample` | Paginated raw observations with category and date filtering |
| `POST` | `/api/chat` | RAG query processing returning structured evidence cards |

---

## 6. Local Setup & Execution

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js v18+ and npm

### Step 1: Start the FastAPI Backend
```bash
cd backend
py -m pip install -r requirements.txt
py -m uvicorn app.main:app --reload --port 8000
```
- **Backend URL:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Step 2: Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- **Frontend URL:** [http://localhost:5173](http://localhost:5173)

---

## 7. Testing
The backend is protected by 24 comprehensive unit and integration tests.
```bash
cd backend
py -m pytest -v
```
**Test Results:**
```text
tests/test_analytics_api.py ........ [ 33%]
tests/test_chat_api.py ...           [ 45%]
tests/test_data_service.py .......   [ 75%]
tests/test_rag.py ...                [ 87%]
tests/test_router.py ...             [100%]
======================= 24 passed in 1.36s =======================
```

---

## 8. Academic Integrity & Grounding
- **Strict Data Fidelity:** Cleaned records are verified deterministically; missing values are never fabricated.
- **Strict LLM Rule:** All numerical outputs originate from Python calculations. The LLM only interprets and contextualizes findings.
- **RAG Provenance:** All literature commentary cites specific paragraph locations and paper authors.
