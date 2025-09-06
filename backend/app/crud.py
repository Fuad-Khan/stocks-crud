# app/crud.py
from sqlalchemy.orm import Session
from app import models, schemas
from typing import List, Optional
from datetime import date

def get_stocks(db: Session, skip: int = 0, limit: int = 100, trade_code: Optional[str]=None):
    q = db.query(models.Stock)
    if trade_code:
        q = q.filter(models.Stock.trade_code == trade_code)
    return q.order_by(models.Stock.date.desc()).offset(skip).limit(limit).all()

def get_stock(db: Session, stock_id: int):
    return db.query(models.Stock).filter(models.Stock.id == stock_id).first()

def create_stock(db: Session, stock: schemas.StockCreate):
    db_stock = models.Stock(**stock.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def update_stock(db: Session, stock_id: int, update: schemas.StockUpdate):
    db_stock = get_stock(db, stock_id)
    if not db_stock:
        return None
    for k, v in update.dict(exclude_unset=True).items():
        setattr(db_stock, k, v)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def delete_stock(db: Session, stock_id: int):
    db_stock = get_stock(db, stock_id)
    if not db_stock:
        return False
    db.delete(db_stock)
    db.commit()
    return True
