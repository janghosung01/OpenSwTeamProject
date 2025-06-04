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

#영화 리뷰 삭제
@router.delete( 
    "/movies/{movie_id}/reviews/{review_id}",   # 영화 ID와 리뷰 ID를 URL 경로로 받음
    response_model=None,    # 응답 모델 없음 (204 No Content)
    status_code=status.HTTP_204_NO_CONTENT,
    summary="영화 리뷰 삭제"    # 엔드포인트 요약
)
def delete_review( 
    movie_id: int = Path(..., description="영화 ID"),   # URL 경로에서 영화 ID를 받음
    review_id: int = Path(..., description="삭제할 리뷰의 ID"), # URL 경로에서 리뷰 ID를 받음
    user_id: str = Query(..., alias="user_id", description="본인 로그인 ID"),   # 쿼리 파라미터로 user_id를 받음 (alias 사용)
    db: Session = Depends(get_db)   # 데이터베이스 세션 의존성
):
    """
    지정된 영화(movie_id)의 특정 리뷰(review_id)를, 
    로그인 ID(user_id)와 매칭되는 작성자만 삭제할 수 있습니다.
    """
    # 1) 작성자 확인을 위해 User 조회 없으면 오류메시지
    user = db.query(User).filter(User.user_id == user_id).first()   # user_id로 사용자 조회
    if not user:    # 사용자 존재 여부 확인
        raise HTTPException(status_code=404, detail="해당 user_id를 가진 사용자가 없습니다.")   # 사용자 없으면 404 에러

    # 2) 리뷰 조회 없으면 오류메시지
    # movie_id와 review_id로 리뷰를 조회
    review = db.query(Review).filter(
        Review.id == review_id, # 리뷰 ID로 필터링
        Review.movie_id == movie_id # 영화 ID로 필터링
    ).first()   # 리뷰 조회
    if not review:  # 리뷰 존재 여부 확인
        raise HTTPException(status_code=404, detail="삭제할 리뷰를 찾을 수 없습니다.")  # 리뷰 없으면 404 에러

    # 3) 권한 확인: 본인 리뷰만 삭제 가능
    if review.user_id != user.id:   # 리뷰 작성자 ID와 로그인 사용자 ID 비교
        raise HTTPException(status_code=403, detail="본인 리뷰만 삭제할 수 있습니다.")  # 본인 리뷰가 아니면 403 에러

    # 4) 리뷰 삭제
    db.delete(review)   # 리뷰 삭제
    db.commit()   # 데이터베이스에 커밋하여 변경사항 반영
    # 204 No Content 를 반환
    return