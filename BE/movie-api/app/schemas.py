from pydantic import BaseModel, Field
from typing import List, Optional

# ---------------------------------------------------------------------------
# TMDB 영화 정보 스키마
# ---------------------------------------------------------------------------
class Movie(BaseModel):
    id: int
    title: str
    overview: str
    poster_path: str
    release_date: str
    vote_average: float
    class Config:
        orm_mode = True

# 영화 목록 응답 스키마
class MoviesResponse(BaseModel):
    results: List[Movie]

