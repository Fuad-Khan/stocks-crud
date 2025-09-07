# app/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stocks CRUD API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # set to frontend url in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/stocks", response_model=list[schemas.StockOut])
def list_stocks(
    skip: int = 0,
    limit: int = 100,  # default 100 rows per page
    trade_code: str | None = None,
    db: Session = Depends(get_db)
):
    return crud.get_stocks(db, skip=skip, limit=limit, trade_code=trade_code)


@app.get("/stocks/{stock_id}", response_model=schemas.StockOut)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    s = crud.get_stock(db, stock_id)
    if not s:
        raise HTTPException(404, "Stock not found")
    return s

@app.post("/stocks", response_model=schemas.StockOut)
def create_stock(stock: schemas.StockCreate, db: Session = Depends(get_db)):
    return crud.create_stock(db, stock)

@app.put("/stocks/{stock_id}", response_model=schemas.StockOut)
def update_stock(stock_id: int, upd: schemas.StockUpdate, db: Session = Depends(get_db)):
    s = crud.update_stock(db, stock_id, upd)
    if not s:
        raise HTTPException(404, "Stock not found")
    return s

@app.delete("/stocks/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_stock(db, stock_id)
    if not ok:
        raise HTTPException(404, "Stock not found")
    return {"deleted": stock_id}

@app.get("/trade_codes", response_model=list[str])
def list_trade_codes(db: Session = Depends(get_db)):
    return crud.get_all_trade_codes(db)
