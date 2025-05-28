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