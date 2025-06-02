# app/routers/reviews.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, Path, status
from sqlalchemy.orm import Session

from app.schemas import ReviewCreate, ReviewOut
from app.models import Review, User
from app.deps import get_db

router = APIRouter()    # 리뷰 관련 라우터

def make_review_out(rev: Review, user_login_id: str) -> ReviewOut:  # 리뷰 객체를 ReviewOut 스키마로 변환
    return ReviewOut(   
        id=rev.id,  # 리뷰 ID
        user_id=user_login_id,  # 로그인 ID (user_id)
        movie_id=rev.movie_id,  # 영화 ID
        rating=rev.rating,  # 평점
        content=rev.content,    # 리뷰 내용
        created_at=rev.created_at,  # 리뷰 작성 시간
    )

@router.post(   
    "/movies/{movie_id}/reviews",   # 영화 ID를 URL 경로로 받음
    response_model=ReviewOut,   # 응답 모델로 ReviewOut 사용
    summary="영화에 리뷰 작성"  # 엔드포인트 요약
)
def add_review( 
    movie_id: int,  # URL 경로에서 영화 ID를 받음
    payload: ReviewCreate, #request의 body에 담긴 데이터
    db: Session = Depends(get_db),  # 데이터베이스 세션 의존성
    user_id: str = Query(..., alias="user_id")  # 쿼리 파라미터로 user_id를 받음 (alias 사용)
):
    user = db.query(User).filter(User.user_id == user_id).first()   # user_id로 사용자 조회
    if not user:    # 사용자 존재 여부 확인
        raise HTTPException(404, "해당 user_id가 없습니다.")    # 사용자 없으면 404 에러
    review = Review(user_id=user.id, movie_id=movie_id, **payload.dict())   # Review 객체 생성
    db.add(review); db.commit(); db.refresh(review) # 데이터베이스에 추가하고 갱신
    return make_review_out(review, user.user_id)   

@router.get(    
    "/movies/{movie_id}/reviews",   # 영화 ID를 URL 경로로 받음
    response_model=List[ReviewOut], # 응답 모델로 ReviewOut 리스트 사용
    summary="영화별 리뷰 조회"  # 엔드포인트 요약
)
def list_movie_reviews(
    movie_id: int,  # URL 경로에서 영화 ID를 받음
    db: Session = Depends(get_db)   # 데이터베이스 세션 의존성
):
    db_reviews = db.query(Review).filter(Review.movie_id == movie_id)\
                                  .order_by(Review.created_at.desc())\
                                  .all()    # 영화 ID로 리뷰 조회
    return [make_review_out(r, r.user.user_id) for r in db_reviews] # ReviewOut 리스트로 변환하여 반환
