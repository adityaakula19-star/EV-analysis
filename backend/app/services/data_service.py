from functools import lru_cache
from typing import Dict, List, Any, Tuple
import pandas as pd

from app.config import settings
from app.services.router_service import ALL_COUNTRIES, VALID_YEARS


@lru_cache(maxsize=1)
def load_cleaned_dataset() -> pd.DataFrame:
    if not settings.dataset_path.exists():
        raise FileNotFoundError(f"Cleaned dataset file not found at: {settings.dataset_path}")
    
    df = pd.read_excel(settings.dataset_path, sheet_name="Cleaned_Data")
    df["date"] = pd.to_datetime(df["date"])
    df["country"] = df["country"].astype(str).str.strip()
    df["vehicle_category"] = df["vehicle_category"].astype(str).str.strip()
    df["subsidy_active"] = df["subsidy_active"].astype(bool)
    return df


def get_dataset_summary_stats() -> Dict[str, Any]:
    df = load_cleaned_dataset()
    total_records = len(df)
    countries = sorted(df["country"].unique().tolist())
    years = sorted(df["year"].dropna().astype(int).unique().tolist())
    total_ev_sales = int(df["ev_units_sold"].sum())
    total_vehicle_sales = int(df["total_new_vehicle_sales"].sum())
    global_penetration = round((total_ev_sales / total_vehicle_sales) * 100, 2) if total_vehicle_sales else 0.0

    # Total charging stations across latest observations per region
    latest_reg = df.sort_values("date").groupby(["country", "region"], as_index=False).tail(1)
    total_charging = int(latest_reg["charging_stations_cumulative"].sum())

    # Weighted average EV price across all EV sales
    avg_price = round(float((df["avg_ev_price_usd"] * df["ev_units_sold"]).sum() / total_ev_sales), 2) if total_ev_sales > 0 else 0.0

    categories = sorted(df["vehicle_category"].unique().tolist())

    date_min = df["date"].min().strftime("%Y-%m-%d") if not df.empty else "2024-01-01"
    date_max = df["date"].max().strftime("%Y-%m-%d") if not df.empty else "2026-08-01"

    return {
        "total_records": total_records,
        "countries": countries,
        "years": years,
        "total_ev_sales": total_ev_sales,
        "total_vehicle_sales": total_vehicle_sales,
        "global_ev_penetration_pct": global_penetration,
        "avg_ev_penetration_pct": global_penetration,
        "total_charging_stations": total_charging,
        "avg_ev_price_usd": avg_price,
        "countries_analyzed": len(countries),
        "total_countries": len(countries),
        "vehicle_categories": categories,
        "total_categories": len(categories),
        "date_range": {"start": date_min, "end": date_max},
    }


def compute_country_year_metrics(country: str, year: int) -> Dict[str, Any] | None:
    df = load_cleaned_dataset()
    sub = df[(df["country"] == country) & (df["year"] == year)]
    if sub.empty:
        return None

    tot_sales = int(sub["total_new_vehicle_sales"].sum())
    ev_sales = int(sub["ev_units_sold"].sum())
    penetration = round((ev_sales / tot_sales) * 100, 2) if tot_sales > 0 else 0.0

    latest_reg = sub.sort_values("date").groupby("region", as_index=False).tail(1)
    charging = float(latest_reg["charging_stations_cumulative"].sum())

    if ev_sales > 0:
        avg_price = float((sub["avg_ev_price_usd"] * sub["ev_units_sold"]).sum() / ev_sales)
    else:
        avg_price = float(sub["avg_ev_price_usd"].mean())

    subsidy_share = round(float(sub["subsidy_active"].mean()) * 100, 2)

    cat_breakdown = {}
    for cat, group in sub.groupby("vehicle_category"):
        cat_ev = int(group["ev_units_sold"].sum())
        cat_tot = int(group["total_new_vehicle_sales"].sum())
        cat_pen = round((cat_ev / cat_tot) * 100, 2) if cat_tot > 0 else 0.0
        cat_breakdown[cat] = {
            "ev_sales": cat_ev,
            "total_sales": cat_tot,
            "penetration_pct": cat_pen,
        }

    return {
        "country": country,
        "year": year,
        "record_count": int(len(sub)),
        "total_new_vehicle_sales": tot_sales,
        "ev_units_sold": ev_sales,
        "ev_penetration_pct": penetration,
        "charging_stations_cumulative": int(charging),
        "avg_ev_price_usd": round(avg_price, 2),
        "subsidy_active_pct": subsidy_share,
        "category_breakdown": cat_breakdown,
    }


def compute_country_trend(country: str) -> List[Dict[str, Any]]:
    results = []
    for yr in VALID_YEARS:
        m = compute_country_year_metrics(country, yr)
        if m:
            results.append(m)
    
    # Calculate YoY growth and total delta
    for i in range(1, len(results)):
        prev = results[i-1]
        curr = results[i]
        sales_growth = round(((curr["ev_units_sold"] - prev["ev_units_sold"]) / prev["ev_units_sold"]) * 100, 2) if prev["ev_units_sold"] else 0.0
        pen_delta_pp = round(curr["ev_penetration_pct"] - prev["ev_penetration_pct"], 2)
        curr["yoy_ev_sales_growth_pct"] = sales_growth
        curr["yoy_penetration_delta_pp"] = pen_delta_pp
    
    if len(results) >= 2:
        first = results[0]
        last = results[-1]
        overall_sales_growth = round(((last["ev_units_sold"] - first["ev_units_sold"]) / first["ev_units_sold"]) * 100, 2) if first["ev_units_sold"] else 0.0
        overall_pen_delta_pp = round(last["ev_penetration_pct"] - first["ev_penetration_pct"], 2)
        results[-1]["period_overall_sales_growth_pct"] = overall_sales_growth
        results[-1]["period_overall_penetration_delta_pp"] = overall_pen_delta_pp

    return results


def compute_comparison(country_a: str, country_b: str, year: int) -> Dict[str, Any] | None:
    mA = compute_country_year_metrics(country_a, year)
    mB = compute_country_year_metrics(country_b, year)
    if not mA or not mB:
        return None

    ev_diff = mA["ev_units_sold"] - mB["ev_units_sold"]
    pen_diff_pp = round(mA["ev_penetration_pct"] - mB["ev_penetration_pct"], 2)
    charging_diff = mA["charging_stations_cumulative"] - mB["charging_stations_cumulative"]
    price_diff = round(mA["avg_ev_price_usd"] - mB["avg_ev_price_usd"], 2)

    higher_penetration = country_a if mA["ev_penetration_pct"] > mB["ev_penetration_pct"] else country_b

    return {
        "year": year,
        "country_a": mA,
        "country_b": mB,
        "ev_sales_diff": ev_diff,
        "penetration_diff_pp": pen_diff_pp,
        "charging_stations_diff": charging_diff,
        "price_diff_usd": price_diff,
        "higher_penetration_country": higher_penetration,
    }


def compute_statistical_correlations() -> Dict[str, float]:
    df = load_cleaned_dataset()
    corr = df[["ev_penetration_pct", "charging_stations_cumulative", "avg_ev_price_usd", "subsidy_active", "ev_units_sold"]].corr()
    
    return {
        "corr_penetration_vs_charging": round(float(corr.loc["ev_penetration_pct", "charging_stations_cumulative"]), 4),
        "corr_penetration_vs_price": round(float(corr.loc["ev_penetration_pct", "avg_ev_price_usd"]), 4),
        "corr_penetration_vs_subsidy": round(float(corr.loc["ev_penetration_pct", "subsidy_active"]), 4),
        "corr_sales_vs_charging": round(float(corr.loc["ev_units_sold", "charging_stations_cumulative"]), 4),
    }


def compute_rankings(year: int = 2025) -> List[Dict[str, Any]]:
    metrics = []
    for c in ALL_COUNTRIES:
        m = compute_country_year_metrics(c, year)
        if m:
            metrics.append(m)
    metrics.sort(key=lambda x: x["ev_penetration_pct"], reverse=True)
    for idx, item in enumerate(metrics, start=1):
        item["rank"] = idx
    return metrics


def calculate_backend_evidence(question_type: str, countries: List[str], years: List[int]) -> Tuple[List[str], Dict[str, Any]]:
    evidence: List[str] = []
    analysis_meta: Dict[str, Any] = {
        "question_type": question_type,
        "countries": countries,
        "years": years,
        "calculations": {},
    }

    df_stats = get_dataset_summary_stats()
    evidence.append(
        f"Backend Dataset Reference: Cleaned dataset contains {df_stats['total_records']} records across "
        f"countries: {', '.join(df_stats['countries'])}; years: {df_stats['years']}."
    )

    target_countries = countries if countries else ALL_COUNTRIES
    target_years = years if years else VALID_YEARS

    if question_type == "country_comparison":
        if len(target_countries) >= 2:
            cA, cB = target_countries[0], target_countries[1]
            for yr in target_years:
                comp = compute_comparison(cA, cB, yr)
                if comp:
                    analysis_meta["calculations"][f"comparison_{cA}_vs_{cB}_{yr}"] = comp
                    mA, mB = comp["country_a"], comp["country_b"]
                    evidence.append(
                        f"CALCULATED COMPARISON ({yr}): {cA} EV new-sales market share penetration = {mA['ev_penetration_pct']}%, "
                        f"EV sales = {mA['ev_units_sold']:,}, avg EV price = ${mA['avg_ev_price_usd']:,}, charging stations = {mA['charging_stations_cumulative']:,}. "
                        f"{cB} EV new-sales market share penetration = {mB['ev_penetration_pct']}%, "
                        f"EV sales = {mB['ev_units_sold']:,}, avg EV price = ${mB['avg_ev_price_usd']:,}, charging stations = {mB['charging_stations_cumulative']:,}. "
                        f"Pre-calculated Difference: {cA} minus {cB} penetration delta = {comp['penetration_diff_pp']} percentage points; "
                        f"sales difference = {comp['ev_sales_diff']:,} units; price difference = ${comp['price_diff_usd']:,} USD."
                    )
        else:
            # Compare first target country against all-country average or benchmark
            for c in target_countries:
                for yr in target_years:
                    m = compute_country_year_metrics(c, yr)
                    if m:
                        evidence.append(
                            f"CALCULATED METRICS ({c}, {yr}): EV Sales = {m['ev_units_sold']:,}, "
                            f"Penetration = {m['ev_penetration_pct']}%, Charging Stations = {m['charging_stations_cumulative']:,}, "
                            f"Avg Price = ${m['avg_ev_price_usd']:,}, Active Subsidy Share = {m['subsidy_active_pct']}%."
                        )

    elif question_type == "trend_analysis":
        for c in target_countries:
            trends = compute_country_trend(c)
            analysis_meta["calculations"][f"trend_{c}"] = trends
            for m in trends:
                yoy_str = f", YoY EV sales growth = {m.get('yoy_ev_sales_growth_pct')}%" if "yoy_ev_sales_growth_pct" in m else ""
                pp_str = f", YoY penetration delta = {m.get('yoy_penetration_delta_pp')} percentage points" if "yoy_penetration_delta_pp" in m else ""
                evidence.append(
                    f"CALCULATED TREND ({c}, {m['year']}): EV Sales = {m['ev_units_sold']:,}, "
                    f"Penetration = {m['ev_penetration_pct']}%{yoy_str}{pp_str}."
                )

    elif question_type == "statistical_questions":
        corrs = compute_statistical_correlations()
        analysis_meta["calculations"]["correlations"] = corrs
        evidence.append(
            f"CALCULATED CORRELATIONS (Cleaned Dataset N=10,304): "
            f"Correlation between EV penetration and charging stations = {corrs['corr_penetration_vs_charging']}; "
            f"Correlation between EV penetration and average EV price = {corrs['corr_penetration_vs_price']}; "
            f"Correlation between EV penetration and active subsidy = {corrs['corr_penetration_vs_subsidy']}."
        )
        for yr in target_years:
            ranks = compute_rankings(yr)
            rank_str = ", ".join([f"#{item['rank']} {item['country']} ({item['ev_penetration_pct']}%)" for item in ranks])
            evidence.append(f"CALCULATED RANKINGS ({yr}): {rank_str}.")

    else: # factor_analysis or general_ev_questions
        for c in target_countries:
            for yr in target_years:
                m = compute_country_year_metrics(c, yr)
                if m:
                    evidence.append(
                        f"CALCULATED FACTOR CONTEXT ({c}, {yr}): EV Penetration = {m['ev_penetration_pct']}%, "
                        f"Avg EV Price = ${m['avg_ev_price_usd']:,}, Cumulative Charging Stations = {m['charging_stations_cumulative']:,}, "
                        f"Subsidy Active Rate = {m['subsidy_active_pct']}%. Category Shares: {m['category_breakdown']}."
                    )

    return evidence, analysis_meta


def get_monthly_country_trends() -> List[Dict[str, Any]]:
    df = load_cleaned_dataset()
    grouped = df.groupby(["date", "country"], as_index=False).agg({
        "ev_units_sold": "sum",
        "total_new_vehicle_sales": "sum",
        "charging_stations_cumulative": "max",
        "avg_ev_price_usd": "mean",
    })
    grouped["ev_penetration_pct"] = round((grouped["ev_units_sold"] / grouped["total_new_vehicle_sales"]) * 100, 2)
    grouped["avg_ev_price_usd"] = round(grouped["avg_ev_price_usd"], 2)
    grouped["date"] = grouped["date"].dt.strftime("%Y-%m-%d")
    grouped.sort_values(["date", "country"], inplace=True)
    return grouped.to_dict(orient="records")


def get_all_country_trends(granularity: str = "yearly") -> Any:
    if granularity == "monthly":
        return get_monthly_country_trends()
    trends_map = {}
    for c in ALL_COUNTRIES:
        trends_map[c] = compute_country_trend(c)
    return trends_map


def get_research_metadata() -> Dict[str, Any]:
    themes = []
    if settings.literature_path.exists():
        try:
            # pyrefly: ignore[missing-import]
            import docx
            doc = docx.Document(settings.literature_path)
            cur_title = ""
            cur_body = []
            for p in doc.paragraphs:
                t = p.text.strip()
                if not t:
                    continue
                if t.startswith("1.") and (" " in t):
                    if cur_title and cur_body:
                        themes.append({"theme": cur_title, "content": "\n\n".join(cur_body)})
                    cur_title = t
                    cur_body = []
                elif cur_title and not t.startswith(("2.", "3.", "4.", "5.")):
                    cur_body.append(t)
            if cur_title and cur_body:
                themes.append({"theme": cur_title, "content": "\n\n".join(cur_body)})
        except Exception:
            pass

    papers = []
    if settings.papers_path.exists():
        try:
            pdf = pd.read_excel(settings.papers_path)
            for idx, row in pdf.iterrows():
                papers.append({
                    "id": int(row.get("#", idx + 1)) if pd.notna(row.get("#")) else idx + 1,
                    "title": str(row.get("Paper Title", "")).strip(),
                    "authors_year": str(row.get("Author(s) & Year", "")).strip(),
                    "pros": str(row.get("Pros", "")).strip(),
                    "cons": str(row.get("What's Missing (Cons)", "")).strip(),
                    "recommendations": str(row.get("What Could Be Done Better", "")).strip(),
                })
        except Exception:
            pass

    return {
        "themes": themes,
        "papers": papers,
        "total_papers": len(papers),
        "total_themes": len(themes),
    }


def get_category_aggregates(country: str | None = None, year: int | None = None) -> List[Dict[str, Any]]:
    df = load_cleaned_dataset()
    sub = df.copy()
    if country:
        sub = sub[sub["country"].str.lower() == country.lower()]
    if year:
        sub = sub[sub["year"] == year]

    results = []
    for cat, grp in sub.groupby("vehicle_category"):
        ev_sales = int(grp["ev_units_sold"].sum())
        total_sales = int(grp["total_new_vehicle_sales"].sum())
        pen_pct = round((ev_sales / total_sales) * 100, 2) if total_sales > 0 else 0.0
        avg_price = round(float(grp["avg_ev_price_usd"].mean()), 2)
        results.append({
            "vehicle_category": cat,
            "ev_units_sold": ev_sales,
            "total_new_vehicle_sales": total_sales,
            "ev_penetration_pct": pen_pct,
            "avg_ev_price_usd": avg_price,
            "record_count": len(grp),
        })
    results.sort(key=lambda x: x["ev_units_sold"], reverse=True)
    return results


def get_dataset_sample(
    page: int = 1,
    limit: int = 50,
    country: str | None = None,
    year: int | None = None,
    vehicle_category: str | None = None
) -> Dict[str, Any]:
    df = load_cleaned_dataset()
    sub = df.copy()

    if country and country.strip():
        sub = sub[sub["country"].str.lower() == country.strip().lower()]
    if year:
        sub = sub[sub["year"] == int(year)]
    if vehicle_category and vehicle_category.strip():
        sub = sub[sub["vehicle_category"].str.lower() == vehicle_category.strip().lower()]

    total_records = len(sub)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit

    sliced = sub.iloc[start_idx:end_idx].copy()
    sliced["date"] = sliced["date"].dt.strftime("%Y-%m-%d")

    records = sliced.to_dict(orient="records")

    return {
        "page": page,
        "limit": limit,
        "total_records": total_records,
        "total_pages": (total_records + limit - 1) // limit if limit > 0 else 1,
        "records": records,
    }

