// src/App.tsx
import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, DollarSign, BarChart3, AlertCircle } from 'lucide-react';
import { fetchDailyData, fetchHistoricalData } from './services/api';
import StockTable from './components/StockTable';
import SummaryCard from './components/SummaryCard';
import MonthSelector from './components/MonthSelector';
import HistoricalChart from './components/HistoricalChart';

interface Stock {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  day_change: number;
  day_change_pct: number;
  volume: number;
}

// No Data Component
const NoDataMessage: React.FC<{ year: number; month: number; stock?: string }> = ({ year, month, stock }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-12 text-center">
      <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
      <p className="text-gray-600 mb-4">
        {stock 
          ? `No data found for ${stock} in ${monthNames[month - 1]} ${year}`
          : `No data found for ${monthNames[month - 1]} ${year}`
        }
      </p>
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">Possible reasons:</p>
        <ul className="text-left space-y-1">
          <li>• Data not available for this time period</li>
          <li>• Selected stock might not have been tracked during this period</li>
          <li>• Market might have been closed (holidays/weekends)</li>
        </ul>
      </div>
    </div>
  );
};

function App() {
  const [daily, setDaily] = useState<Stock[]>([]);
  const [historical, setHistorical] = useState<Stock[]>([]);
  const [filteredHistorical, setFilteredHistorical] = useState<Stock[]>([]);
  const [isDailyLoading, setIsDailyLoading] = useState(true);
  const [isHistoricalLoading, setIsHistoricalLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [hasHistoricalData, setHasHistoricalData] = useState(false);
  const [historicalError, setHistoricalError] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  
  // Historical data selectors
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedStock, setSelectedStock] = useState('');

  // Get available stocks from daily data
  const availableStocks = Array.from(new Set(daily.map(stock => stock.symbol))).sort();

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(num);
  };

  const loadDailyData = async () => {
    setIsDailyLoading(true);
    try {
      const dailyRes = await fetchDailyData();
      setDaily(dailyRes.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching daily data:', error);
    } finally {
      setIsDailyLoading(false);
    }
  };

  const loadHistoricalData = async () => {
    setIsHistoricalLoading(true);
    setHistoricalError(null);
    setHasHistoricalData(false);
    setShowChart(false);
    
    try {
      const historicalRes = await fetchHistoricalData(selectedYear, selectedMonth);
      
      if (historicalRes.data && historicalRes.data.length > 0) {
        setHistorical(historicalRes.data);
        setHasHistoricalData(true);
        setShowChart(true); // Show chart when data is loaded
        
        // Apply stock filter if selected
        if (selectedStock) {
          const filtered = historicalRes.data.filter((stock: Stock) => stock.symbol === selectedStock);
          setFilteredHistorical(filtered);
        } else {
          setFilteredHistorical(historicalRes.data);
        }
      } else {
        setHistorical([]);
        setFilteredHistorical([]);
        setHasHistoricalData(false);
        setShowChart(false);
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setHistoricalError('Failed to load data. Please try again.');
      setHistorical([]);
      setFilteredHistorical([]);
      setHasHistoricalData(false);
      setShowChart(false);
    } finally {
      setIsHistoricalLoading(false);
    }
  };

  // Load daily data on component mount
  useEffect(() => {
    loadDailyData();
  }, []);

  // Update filtered data when stock selection changes
  useEffect(() => {
    if (historical.length > 0) {
      if (selectedStock) {
        const filtered = historical.filter(stock => stock.symbol === selectedStock);
        setFilteredHistorical(filtered);
      } else {
        setFilteredHistorical(historical);
      }
    }
  }, [selectedStock, historical]);

  const calculateSummary = (data: Stock[]) => {
    if (data.length === 0) return { totalValue: 0, totalChange: 0, avgChangePercent: 0 };
    
    const totalValue = data.reduce((sum, stock) => sum + stock.close, 0);
    const totalChange = data.reduce((sum, stock) => sum + stock.day_change, 0);
    const avgChangePercent = data.reduce((sum, stock) => sum + stock.day_change_pct, 0) / data.length;
    
    return { totalValue, totalChange, avgChangePercent };
  };

  const summary = calculateSummary(daily);

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  const getHistoricalTitle = () => {
    const monthName = getMonthName(selectedMonth);
    const stockFilter = selectedStock ? ` - ${selectedStock}` : '';
    return `Historical Data (${monthName} ${selectedYear}${stockFilter})`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-3 mr-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Portfolio Tracker</h1>
                <p className="text-gray-600">
                  Last updated: {lastUpdated.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <button
              onClick={loadDailyData}
              disabled={isDailyLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isDailyLoading ? 'animate-spin' : ''}`} />
              Refresh Today's Data
            </button>
          </div>
        </div>

        {/* Summary Cards - Only for today's data */}
        {!isDailyLoading && daily.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard
              title="Portfolio Value"
              value={formatCurrency(summary.totalValue)}
              change={`${summary.totalChange >= 0 ? '+' : ''}${formatCurrency(summary.totalChange)}`}
              isPositive={summary.totalChange >= 0}
              icon={<DollarSign className="h-8 w-8" />}
            />
            <SummaryCard
              title="Average Change"
              value={`${summary.avgChangePercent >= 0 ? '+' : ''}${summary.avgChangePercent.toFixed(2)}%`}
              change={summary.avgChangePercent >= 0 ? 'Positive trend' : 'Negative trend'}
              isPositive={summary.avgChangePercent >= 0}
              icon={<BarChart3 className="h-8 w-8" />}
            />
            <SummaryCard
              title="Active Stocks"
              value={daily.length.toString()}
              change={`${daily.filter(s => s.day_change > 0).length} gaining`}
              isPositive={daily.filter(s => s.day_change > 0).length >= daily.length / 2}
              icon={<TrendingUp className="h-8 w-8" />}
            />
          </div>
        )}

        {/* Today's Market Data */}
        <div className="mb-8">
          <StockTable 
            data={daily} 
            title="Today's Market Data" 
            isLoading={isDailyLoading}
          />
        </div>

        {/* Historical Data Section */}
        <div className="space-y-6">
          <MonthSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedStock={selectedStock}
            availableStocks={availableStocks}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            onStockChange={setSelectedStock}
            onLoadData={loadHistoricalData}
            isLoading={isHistoricalLoading}
            hasData={hasHistoricalData}
          />
          
          {/* Historical Chart */}
          {showChart && !isHistoricalLoading && (
            <HistoricalChart 
              data={filteredHistorical}
              title={getHistoricalTitle()}
              selectedStock={selectedStock}
            />
          )}
          
          {/* Historical Data Table */}
          {isHistoricalLoading ? (
            <StockTable 
              data={[]} 
              title={getHistoricalTitle()}
              isLoading={true}
            />
          ) : hasHistoricalData && filteredHistorical.length > 0 ? (
            <StockTable 
              data={filteredHistorical} 
              title={getHistoricalTitle()}
              isLoading={false}
            />
          ) : hasHistoricalData && filteredHistorical.length === 0 && selectedStock ? (
            <NoDataMessage year={selectedYear} month={selectedMonth} stock={selectedStock} />
          ) : hasHistoricalData === false && !isHistoricalLoading ? (
            <NoDataMessage year={selectedYear} month={selectedMonth} />
          ) : null}

          {/* Error Message */}
          {historicalError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800">{historicalError}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;