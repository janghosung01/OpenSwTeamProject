import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import movies

app = FastAPI(title="MOVIE API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


# 라우터 등록
app.include_router(movies.router, prefix="", tags=["Movies"])