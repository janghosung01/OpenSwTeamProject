from typing import List
from fastapi import APIRouter, Query

from app.schemas import Movie, MoviesResponse
from app.utils import fetch_tmdb, TMDB_API_KEY

# APIRouter 인스턴스를 생성하여 각 엔드포인트를 그룹화합니다.
router = APIRouter() 

# 최신 영화 20개 조회 엔드포인트
@router.get("/latest", response_model=MoviesResponse, summary="최신 영화 20개 조회") 
async def get_latest_movies():
    data = await fetch_tmdb(
        endpoint="movie/now_playing",
        params={"api_key": TMDB_API_KEY, "language": "ko-KR", "page": 1},   # 페이지 1의 최신 영화 조회
    )
    return MoviesResponse(results=data.get("results", [])[:20]) # 최신 영화 중 상위 20개만 반환

# 영화 검색 엔드포인트
@router.get("/search", response_model=MoviesResponse, summary="영화 검색")
async def search_movie(query: str = Query(..., min_length=1)):
    data = await fetch_tmdb(
        endpoint="search/movie",
        params={"api_key": TMDB_API_KEY, "query": query, "language": "ko-KR"}, # 검색어로 영화 조회
    )
    return MoviesResponse(results=data.get("results", [])[:5]) # 검색 결과 중 상위 5개만 반환
