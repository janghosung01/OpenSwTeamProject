from typing import List
from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from app.schemas import UserCreate, UserOut # 사용자 관련 스키마
from app.models import User # 사용자 모델
from app.deps import get_db # 데이터베이스 세션 의존성
from app.utils import fetch_tmdb, TMDB_API_KEY # TMDB API 키 가져오기

router = APIRouter() # 사용자 관련 라우터

# 회원가입 엔드포인트
@router.post("/register", response_model=UserOut, summary="회원가입")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.user_id == user.user_id).first(): # 이미 존재하는 user_id인지 확인
        raise HTTPException(400, "이미 존재하는 user_id")
    new_user = User(**user.dict())
    db.add(new_user) # 새 사용자 추가
    db.commit() # 데이터베이스에 커밋
    db.refresh(new_user) # 새 사용자 객체 갱신
    return new_user # 새 사용자 정보 반환
# 사용자 목록 조회 엔드포인트
@router.get("/users", response_model=List[UserOut], summary="사용자 목록 조회")
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all() # 데이터베이스에서 모든 사용자 조회