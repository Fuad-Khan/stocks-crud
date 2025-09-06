# app/load_data.py
import pandas as pd
import json
from datetime import datetime
from app.database import SessionLocal, engine, Base
from app import models
import os

# Adjust path to your uploaded files if needed
CSV_PATH = os.path.join(os.getcwd(), "stock_market_data.csv")
JSON_PATH = os.path.join(os.getcwd(), "stock_market_data.json")

def parse_number(x):
    if x is None:
        return None
    s = str(x).strip().replace(",", "")
    if s == "" or s in {"0", "0.0", "-999,999.99", "-999999.99", "-999999.99"}:
        try:
            # Some zeros are valid close values; choose to store 0 as is, but -999.. as None
            if "-" in s:
                return None
            return float(s)
        except:
            return None
    try:
        return float(s)
    except:
        return None

def parse_volume(x):
    if x is None: return None
    s = str(x).strip().replace(",", "")
    if s == "" or s == "0": return 0
    try:
        return int(float(s))
    except:
        return None

def parse_date(x):
    # Accept YYYY-MM-DD
    if pd.isna(x): return None
    s = str(x).strip()
    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(s, fmt).date()
        except:
            pass
    try:
        return pd.to_datetime(s).date()
    except:
        return None

def load_csv_to_db():
    df = pd.read_csv(CSV_PATH)
    # normalize columns (if header mismatch)
    df.rename(columns=lambda c: c.strip(), inplace=True)
    db = SessionLocal()
    for _, row in df.iterrows():
        d = parse_date(row.get("date"))
        if d is None:
            continue
        rec = models.Stock(
            date=d,
            trade_code=str(row.get("trade_code")),
            high=parse_number(row.get("high")),
            low=parse_number(row.get("low")),
            open=parse_number(row.get("open")),
            close=parse_number(row.get("close")),
            volume=parse_volume(row.get("volume"))
        )
        db.add(rec)
    db.commit()
    db.close()

def load_json_to_db():
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    db = SessionLocal()
    for row in data:
        d = parse_date(row.get("date"))
        if d is None: continue
        rec = models.Stock(
            date=d,
            trade_code=str(row.get("trade_code")),
            high=parse_number(row.get("high")),
            low=parse_number(row.get("low")),
            open=parse_number(row.get("open")),
            close=parse_number(row.get("close")),
            volume=parse_volume(row.get("volume"))
        )
        db.add(rec)
    db.commit()
    db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    # prefer CSV (keeps original JSON file intact in jsonModel folder)
    if os.path.exists(CSV_PATH):
        load_csv_to_db()
    elif os.path.exists(JSON_PATH):
        load_json_to_db()
    print("Data loaded.")
