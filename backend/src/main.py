from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
from fastapi.responses import JSONResponse

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend port
    allow_methods=["*"],
    allow_headers=["*"],
)

# DATA_DIR = "data"

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
DATA_DIR = os.path.abspath(DATA_DIR)

def clean_symbol_column(df: pd.DataFrame) -> pd.DataFrame:
    if "symbol" in df.columns:
        df["symbol"] = df["symbol"].str.replace(".NS", "", regex=False)
    return df

@app.get("/api/daily")
def get_daily_data():
    files = [f for f in os.listdir(DATA_DIR) if f.startswith("daily")]
    if not files:
        return JSONResponse(content={"error": "No daily data found"}, status_code=404)
    latest_file = sorted(files)[-1]
    df = pd.read_csv(os.path.join(DATA_DIR, latest_file))
    df = clean_symbol_column(df)
    return df.to_dict(orient="records")

@app.get("/api/historical/{year}-{month}")
def get_historical_data(year: int, month: int):
    filename = f"historical_{year}_{month:02d}.csv"
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return JSONResponse(content={"error": "File not found"}, status_code=404)
    df = pd.read_csv(path)
    df = clean_symbol_column(df)
    return df.to_dict(orient="records")
