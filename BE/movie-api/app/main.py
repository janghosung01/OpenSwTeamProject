import os
from fastapi import FastAPI # FastAPI 애플리케이션 생성
from fastapi.middleware.cors import CORSMiddleware # CORS 미들웨어

from app.database import engine, Base # 데이터베이스 엔진과 베이스 클래스 임포트
from app.routers import movies, users, reviews # 라우터 임포트

app = FastAPI(title="MOVIE API")

# CORS 설정
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  # 리액트 환경
        "http://127.0.0.1:5500",  #내 로컬
        "https://movie-api-test-latest.onrender.com", #배포 서버"
        "https://open-sw-team-project.vercel.app"  # 프론트 배포 서버
    ], 
    allow_methods=["*"], # 모든 HTTP 메서드 허용
    allow_headers=["*"], # 모든 헤더 허용
    allow_credentials=True, # 쿠키 인증 허용
)

@app.on_event("startup")
def on_startup():
    # DB 테이블 생성
    Base.metadata.create_all(bind=engine)

# 라우터 등록
app.include_router(movies.router, prefix="", tags=["Movies"])
app.include_router(users.router, prefix="", tags=["Users"])
app.include_router(reviews.router, prefix="", tags=["Reviews"])