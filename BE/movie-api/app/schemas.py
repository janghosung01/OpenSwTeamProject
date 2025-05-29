from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# ---------------------------------------------------------------------------
# TMDB 영화 정보 스키마
# ---------------------------------------------------------------------------
class Movie(BaseModel): # 영화 정보 스키마
    id: int # 영화 ID
    title: str # 영화 제목
    overview: str # 영화 설명
    poster_path: str # 포스터 이미지 경로
    release_date: str # 개봉일 (YYYY-MM-DD 형식)
    vote_average: float # 평점 (0.0 ~ 10.0)
    class Config: # Pydantic 설정
        orm_mode = True # ORM 모델과 호환되도록 설정

# 영화 목록 응답 스키마
class MoviesResponse(BaseModel):
    results: List[Movie]


# ---------------------------------------------------------------------------
# 사용자 관련 스키마
# ---------------------------------------------------------------------------
class UserCreate(BaseModel):
    """회원가입 요청 스키마"""
    name: str # 사용자 이름 (필수)
    user_id: str = Field(..., alias="userId") # 사용자 ID (필수)
    password: str # 비밀번호
    gender: Optional[str] = None # 성별 (선택)

class UserOut(BaseModel):
    """회원 정보 응답 스키마"""
    id: int # 데이터베이스 ID
    name: str # 사용자 이름
    user_id: str = Field(..., alias="userId") # 사용자 ID
    gender: Optional[str] = None # 성별

    class Config: # Pydantic 설정
        from_attributes = True # ORM 모델에서 속성 가져오기
        validate_by_name = True # 별칭 사용
