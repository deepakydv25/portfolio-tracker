import pandas as pd
from datetime import datetime, timedelta
import os
import yfinance as yf

# Load symbols
with open("symbols.txt", "r") as f:
    symbols = [line.strip() for line in f if line.strip()]

# Load month-year list
with open("months.txt", "r") as f:
    month_years = [line.strip() for line in f if line.strip()]

# Create data directory
data_dir = "data/historical"
os.makedirs(data_dir, exist_ok=True)

# Format function
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

# Loop through months
for month_year in month_years:
    month_str, year_str = month_year.split("-")
    target_month = int(month_str)
    target_year = int(year_str)

    start_date = datetime(target_year, target_month, 1).date()
    if target_month == 12:
        end_date = datetime(target_year + 1, 1, 1).date() - timedelta(days=1)
    else:
        end_date = datetime(target_year, target_month + 1, 1).date() - timedelta(days=1)

    month_key = start_date.strftime("%Y_%m")
    output_file = os.path.join(data_dir, f"historical_{month_key}.csv")

    all_data = []
    for symbol in symbols:
        df = yf.download(symbol, start=start_date, end=end_date + timedelta(days=1))
        if not df.empty:
            all_data.append(process_df(df, symbol))

    if all_data:
        pd.concat(all_data).to_csv(output_file, index=False)
        print(f"✅ Saved: {output_file}")
    else:
        print(f"⚠️ No data for {month_key}")
