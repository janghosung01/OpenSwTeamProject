# app/utils.py
import os, httpx

TMDB_API_KEY = os.getenv("TMDB_API_KEY") # TMDB API 키를 환경변수에서 가져오기
if not TMDB_API_KEY: # 환경변수에 API 키가 설정되어 있지 않으면 예외 발생
    raise RuntimeError("TMDB_API_KEY 환경변수가 설정되지 않았습니다.")

async def fetch_tmdb(endpoint: str, params: dict) -> dict: # TMDB API에서 데이터를 비동기로 가져오는 함수
    url = f"https://api.themoviedb.org/3/{endpoint}" # TMDB API 엔드포인트 URL
    async with httpx.AsyncClient() as client: # HTTP 클라이언트 생성
        res = await client.get(url, params=params) # GET 요청
        res.raise_for_status() # 응답 상태 코드가 200이 아니면 예외 발생
        return res.json() # JSON 응답 반환
