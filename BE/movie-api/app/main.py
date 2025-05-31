import os
from fastapi import FastAPI # FastAPI 애플리케이션 생성
from fastapi.middleware.cors import CORSMiddleware # CORS 미들웨어

from app.database import engine, Base # 데이터베이스 엔진과 베이스 클래스 임포트
from app.routers import movies, users # 라우터 모듈 임포트

app = FastAPI(title="MOVIE API")

# CORS 설정
app.add_middleware( 
    CORSMiddleware,
    allow_origins=["http://localhost:5173",  # 리액트 환경
        "http://127.0.0.1:5500",  #내 로컬
        "https://movie-api-test-latest.onrender.com", #배포 서버"
        # 나중에 배포 서버 주소(프론트 배포시) 추가
    ], 
    allow_methods=["*"], # 모든 HTTP 메서드 허용
    allow_headers=["*"], # 모든 헤더 허용
    allow_credentials=True, # 쿠키 인증 허용
)


# 라우터 등록
app.include_router(movies.router, prefix="", tags=["Movies"])
app.include_router(users.router, prefix="", tags=["Users"])