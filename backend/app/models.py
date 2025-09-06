# app/models.py
from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Date as SA_Date
import datetime

class Stock(Base):
    __tablename__ = "stocks"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True, nullable=False)
    trade_code = Column(String, index=True, nullable=False)
    high = Column(Float, nullable=True)
    low = Column(Float, nullable=True)
    open = Column(Float, nullable=True)
    close = Column(Float, nullable=True)
    volume = Column(Integer, nullable=True)
