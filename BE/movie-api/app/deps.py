from .database import SessionLocal

def get_db(): # 데이터베이스 세션을 생성하고 반환하는 의존성 함수
    db = SessionLocal() # 세션 생성
    try:
        yield db # 세션을 호출하는 곳에 전달
    finally:
        db.close() # 세션을 닫아 리소스 해제