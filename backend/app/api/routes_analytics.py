from fastapi import APIRouter, Query
from typing import Optional, Any, Union, Dict, List

from app.services.data_service import (
    get_dataset_summary_stats,
    get_all_country_trends,
    compute_statistical_correlations,
    get_category_aggregates,
    get_dataset_sample,
    compute_comparison,
    get_research_metadata,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/overview")
def get_overview() -> dict:
    return get_dataset_summary_stats()


@router.get("/country-trends")
def get_country_trends(
    granularity: Optional[str] = Query("yearly", description="Granularity: 'yearly' or 'monthly'"),
) -> Any:
    return get_all_country_trends(granularity=granularity)


@router.get("/compare")
def compare_countries(
    country_a: str = Query(..., description="First country to compare"),
    country_b: str = Query(..., description="Second country to compare"),
    year: Optional[int] = Query(2025, description="Year to compare"),
) -> dict:
    comp = compute_comparison(country_a, country_b, year or 2025)
    if not comp:
        return {"error": f"Comparison not available for {country_a} and {country_b} in {year}"}
    return comp


@router.get("/research")
def get_research() -> dict:
    return get_research_metadata()


@router.get("/correlations")
def get_correlations() -> dict:
    return compute_statistical_correlations()


@router.get("/categories")
def get_categories(
    country: Optional[str] = Query(None, description="Filter by country"),
    year: Optional[int] = Query(None, description="Filter by year"),
) -> list:
    return get_category_aggregates(country=country, year=year)


@router.get("/dataset-sample")
def get_sample(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(50, ge=1, le=500, description="Records per page"),
    country: Optional[str] = Query(None, description="Filter by country"),
    year: Optional[int] = Query(None, description="Filter by year"),
    vehicle_category: Optional[str] = Query(None, description="Filter by vehicle category"),
) -> dict:
    return get_dataset_sample(
        page=page,
        limit=limit,
        country=country,
        year=year,
        vehicle_category=vehicle_category,
    )
