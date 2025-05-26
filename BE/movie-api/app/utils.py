# app/utils.py
import os, httpx

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
if not TMDB_API_KEY:
    raise RuntimeError("TMDB_API_KEY 환경변수가 설정되지 않았습니다.")

async def fetch_tmdb(endpoint: str, params: dict) -> dict:
    url = f"https://api.themoviedb.org/3/{endpoint}"
    async with httpx.AsyncClient() as client:
        res = await client.get(url, params=params)
        res.raise_for_status()
        return res.json()
