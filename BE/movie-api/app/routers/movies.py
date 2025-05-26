from typing import List
from fastapi import APIRouter, Query

from app.schemas import Movie, MoviesResponse
from app.utils import fetch_tmdb, TMDB_API_KEY


router = APIRouter()

@router.get("/search", response_model=MoviesResponse, summary="영화 검색")
async def search_movie(query: str = Query(..., min_length=1)):
    data = await fetch_tmdb(
        endpoint="search/movie",
        params={"api_key": TMDB_API_KEY, "query": query, "language": "ko-KR"},
    )
    return MoviesResponse(results=data.get("results", [])[:5])
