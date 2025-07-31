import pandas as pd
from datetime import date, timedelta
import yfinance as yf
import os

# Read stock symbols
with open("symbols.txt", "r") as f:
    symbols = [line.strip() for line in f if line.strip()]

# Create data folder if not exists
os.makedirs("data", exist_ok=True)

# Today's date (if weekend or holiday, fallback to previous day)
today = date.today()
yesterday = today - timedelta(days=1)

# Fetch data for today (or fallback)
start_date = today
end_date = today + timedelta(days=1)

# Output file
output_file = f"data/daily_{today.strftime('%Y_%m_%d')}.csv"

all_data = []

def process_df(df, symbol):
    df['symbol'] = symbol
    df = df.reset_index()
    df['day_change'] = df['Close'] - df['Open']
    df['day_change_pct'] = ((df['Close'] - df['Open']) / df['Open']) * 100
    df = df[['symbol', 'Date', 'Open', 'High', 'Low', 'Close', 'day_change', 'day_change_pct', 'Volume']]
    df.columns = ['symbol', 'date', 'open', 'high', 'low', 'close', 'day_change', 'day_change_pct', 'volume']
    float_cols = ['open', 'high', 'low', 'close', 'day_change', 'day_change_pct']
    df[float_cols] = df[float_cols].applymap(lambda x: f"{x:.2f}")
    return df

# Fetch and process each symbol
for symbol in symbols:
    df = yf.download(symbol, start=start_date, end=end_date, progress=False)
    if not df.empty:
        processed = process_df(df, symbol)
        all_data.append(processed)

# Save if data is available
if all_data:
    pd.concat(all_data).to_csv(output_file, index=False)
    print(f"✅ Today's data saved: {output_file}")
else:
    print("⚠️ No trading data available for today.")
