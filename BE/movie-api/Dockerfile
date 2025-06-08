# Python 3.11 기반의 경량 이미지 사용
FROM python:3.11-slim

# pg_isready 를 포함한 클라이언트 툴 설치
RUN apt-get update \
 && apt-get install -y postgresql-client \
 && rm -rf /var/lib/apt/lists/*

 # 작업 디렉토리 설정
 WORKDIR /app 

#Poetry 설치
RUN pip install poetry

# Poetry 설정: 캐시 디렉토리 변경
COPY pyproject.toml poetry.lock* /app/

# Poetry를 이용하여 의존성 설치 
RUN poetry config virtualenvs.create false \
 && poetry install --no-root --no-interaction

# 전체 소스 복사
COPY . /app

# 컨테이너 실행 시 FastAPI 실행
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

