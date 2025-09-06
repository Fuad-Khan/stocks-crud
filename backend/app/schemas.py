# app/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class StockBase(BaseModel):
    date: date
    trade_code: str
    high: Optional[float] = None
    low: Optional[float] = None
    open: Optional[float] = None
    close: Optional[float] = None
    volume: Optional[int] = None

class StockCreate(StockBase):
    pass

class StockUpdate(BaseModel):
    high: Optional[float] = None
    low: Optional[float] = None
    open: Optional[float] = None
    close: Optional[float] = None
    volume: Optional[int] = None

class StockOut(StockBase):
    id: int
    class Config:
        orm_mode = True
