import pandas as pd
from datetime import datetime, timedelta
import os
import yfinance as yf

# Configurable paths
symbol_file = "symbols.txt"

# Load symbols from file
with open(symbol_file, "r") as f:
    symbols = [line.strip() for line in f.readlines() if line.strip()]

# Set date range
today = datetime.today().date()
start_of_month = today.replace(day=1)
yesterday = today - timedelta(days=1)

# File paths
data_dir = "data"
os.makedirs(data_dir, exist_ok=True)
month_key = start_of_month.strftime("%Y_%m")
historical_csv = os.path.join(data_dir, f"historical_{month_key}.csv")
daily_csv = os.path.join(data_dir, "daily.csv")

# Process function
def process_df(df, symbol):
    df['symbol'] = symbol
    df = df.reset_index()
    df['day_change'] = (df['Close'] - df['Open']).round(2)
    df['day_change_pct'] = ((df['Close'] - df['Open']) / df['Open'] * 100).round(2)
    df = df[['symbol', 'Date', 'Open', 'High', 'Low', 'Close', 'day_change', 'day_change_pct', 'Volume']]
    df.columns = ['symbol', 'date', 'open', 'high', 'low', 'close', 'day_change', 'day_change_pct', 'volume']
    
    # Format all float values to 2 decimal digits
    float_cols = ['open', 'high', 'low', 'close', 'day_change', 'day_change_pct']
    df[float_cols] = df[float_cols].applymap(lambda x: f"{x:.2f}")

    return df

# Historical data
historical_data = []
for symbol in symbols:
    df = yf.download(symbol, start=start_of_month, end=today)
    if not df.empty:
        historical_data.append(process_df(df, symbol))

if historical_data:
    pd.concat(historical_data).to_csv(historical_csv, index=False)


# Daily data (yesterday only)
daily_data = []
for symbol in symbols:
    df = yf.download(symbol, start=yesterday, end=today)
    if not df.empty:
        daily_data.append(process_df(df, symbol))

if daily_data:
    pd.concat(daily_data).to_csv(daily_csv, index=False)

print("✅ Data saved in 'data/' folder with 2-decimal values and day change info.")
