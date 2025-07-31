// src/services/api.ts
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const fetchDailyData = () => axios.get(`${API_BASE}/api/daily`);

export const fetchHistoricalData = (year: number, month: number) =>
  axios.get(`${API_BASE}/api/historical/${year}-${month}`);
