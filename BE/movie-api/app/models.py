from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):   # 사용자 모델
    __tablename__ = "users" # 사용자 테이블
    id       = Column(Integer, primary_key=True, index=True)    # 사용자 ID
    name     = Column(String(150), nullable=False)  # 사용자 이름
    user_id  = Column(String(50), unique=True, index=True, nullable=False)  # 로그인 ID
    password = Column(String(128), nullable=False)  # 비밀번호
    gender   = Column(String(10), nullable=True)    # 성별

    # Review.user_id → User.id 로 매핑
    reviews  = relationship("Review", back_populates="user", cascade="all, delete-orphan")

class Review(Base): # 리뷰 모델
    __tablename__ = "reviews"   # 리뷰 테이블
    id         = Column(Integer, primary_key=True, index=True)     # 리뷰 ID
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)  # 정수 PK FK
    movie_id   = Column(Integer, nullable=False, index=True)    # 영화 ID
    rating     = Column(Float, nullable=False)  # 평점
    content    = Column(Text, nullable=False)   # 리뷰 내용
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False) # 리뷰 작성 시간

    user = relationship("User", back_populates="reviews")   # User.id → Review.user_id 로 매핑
