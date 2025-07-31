// src/components/HistoricalChart.tsx
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

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

interface HistoricalChartProps {
  data: Stock[];
  title: string;
  selectedStock?: string;
}

type ChartType = 'line' | 'bar' | 'volume';

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, title, selectedStock }) => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetric, setSelectedMetric] = useState<'close' | 'volume' | 'change' | 'change_amount'>('close');

  // Process data for charts
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Group data by date and aggregate if multiple stocks
    const groupedData = data.reduce((acc, stock) => {
      const dateKey = new Date(stock.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      });

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          fullDate: stock.date,
          stocks: []
        };
      }
      acc[dateKey].stocks.push(stock);
      return acc;
    }, {} as Record<string, { date: string; fullDate: string; stocks: Stock[] }>);

    // Convert to array and calculate aggregated values
    return Object.values(groupedData)
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime())
      .map(item => {
        const stocks = item.stocks;
        const avgClose = stocks.reduce((sum, s) => sum + s.close, 0) / stocks.length;
        const totalVolume = stocks.reduce((sum, s) => sum + s.volume, 0);
        const avgChange = stocks.reduce((sum, s) => sum + s.day_change_pct, 0) / stocks.length;
        const avgChangeAmount = stocks.reduce((sum, s) => sum + s.day_change, 0) / stocks.length;
        const maxHigh = Math.max(...stocks.map(s => s.high));
        const minLow = Math.min(...stocks.map(s => s.low));

        return {
          date: item.date,
          close: Number(avgClose.toFixed(2)),
          volume: totalVolume,
          change: Number(avgChange.toFixed(2)),
          change_amount: Number(avgChangeAmount.toFixed(2)),
          high: Number(maxHigh.toFixed(2)),
          low: Number(minLow.toFixed(2)),
          stockCount: stocks.length
        };
      });
  }, [data]);

  // Get unique stocks for individual stock analysis
  const availableStocks = useMemo(() => {
    return Array.from(new Set(data.map(stock => stock.symbol))).sort();
  }, [data]);

  // Filter data for individual stock if selected
  const individualStockData = useMemo(() => {
    if (!selectedStock || !data) return [];
    
    return data
      .filter(stock => stock.symbol === selectedStock)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(stock => ({
        date: new Date(stock.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short'
        }),
        close: stock.close,
        volume: stock.volume,
        change: stock.day_change_pct,
        change_amount: stock.day_change,
        high: stock.high,
        low: stock.low,
        open: stock.open
      }));
  }, [data, selectedStock]);

  const displayData = selectedStock ? individualStockData : chartData;

  // Calculate summary statistics
  const stats = useMemo(() => {
    if (displayData.length === 0) return null;

    const closes = displayData.map(d => d.close);
    const volumes = displayData.map(d => d.volume);
    const changes = displayData.map(d => d.change);

    return {
      maxPrice: Math.max(...closes),
      minPrice: Math.min(...closes),
      avgPrice: closes.reduce((sum, price) => sum + price, 0) / closes.length,
      totalVolume: volumes.reduce((sum, vol) => sum + vol, 0),
      avgVolume: volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length,
      avgChange: changes.reduce((sum, change) => sum + change, 0) / changes.length,
      positiveChangeDays: changes.filter(change => change > 0).length,
      totalDays: displayData.length
    };
  }, [displayData]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Data</h3>
        <p className="text-gray-600">Load historical data to view price trends</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-semibold">
                {entry.name === 'Volume' ? formatVolume(entry.value) : 
                 entry.name === 'Change %' ? `${entry.value.toFixed(2)}%` :
                 entry.name === 'Change Amount' ? formatCurrency(entry.value) :
                 formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title} - Chart Analysis</h3>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex items-center gap-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="volume">Volume Chart</option>
          </select>
          
          {chartType !== 'volume' && (
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as 'close' | 'volume' | 'change' | 'change_amount')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="close">Closing Price</option>
              <option value="change">Daily Change %</option>
              <option value="change_amount">Daily Change ₹</option>
            </select>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">Avg Price</div>
            <div className="text-lg font-bold text-blue-900">
              {formatCurrency(stats.avgPrice)}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-green-600 font-medium">Max Price</div>
            <div className="text-lg font-bold text-green-900">
              {formatCurrency(stats.maxPrice)}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-xs text-red-600 font-medium">Min Price</div>
            <div className="text-lg font-bold text-red-900">
              {formatCurrency(stats.minPrice)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-xs text-purple-600 font-medium">Positive Days</div>
            <div className="text-lg font-bold text-purple-900">
              {stats.positiveChangeDays}/{stats.totalDays}
            </div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => 
                  selectedMetric === 'volume' ? formatVolume(value) :
                  selectedMetric === 'change' ? `${value}%` :
                  selectedMetric === 'change_amount' ? formatCurrency(value) :
                  formatCurrency(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {selectedMetric === 'close' && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="close" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Close Price"
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                  {selectedStock && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="high" 
                        stroke="#10b981" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="High"
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="low" 
                        stroke="#ef4444" 
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        name="Low"
                        dot={false}
                      />
                    </>
                  )}
                </>
              )}
              
              {selectedMetric === 'change' && (
                <Line 
                  type="monotone" 
                  dataKey="change" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Change %"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              )}

              {selectedMetric === 'change_amount' && (
                <Line 
                  type="monotone" 
                  dataKey="change_amount" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Change Amount"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              )}
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => 
                  selectedMetric === 'change' ? `${value}%` : 
                  selectedMetric === 'change_amount' ? formatCurrency(value) :
                  formatCurrency(value)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar 
                dataKey={selectedMetric} 
                fill={selectedMetric === 'change' ? '#8b5cf6' : 
                     selectedMetric === 'change_amount' ? '#f59e0b' : '#3b82f6'}
                name={selectedMetric === 'change' ? 'Change %' : 
                     selectedMetric === 'change_amount' ? 'Change Amount' : 'Close Price'}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          ) : (
            <BarChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fontSize: 12 }}
                tickFormatter={formatVolume}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              <Bar 
                dataKey="volume" 
                fill="#f59e0b"
                name="Volume"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Info */}
      <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span>
            {selectedStock ? `Showing data for ${selectedStock}` : `Showing aggregated data for ${availableStocks.length} stocks`}
          </span>
          <span>
            {displayData.length} data points
          </span>
        </div>
        {stats && (
          <div className="mt-2 text-xs">
            Average daily change: <span className={`font-medium ${stats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
            </span>
            {' • '}
            Total volume: {formatVolume(stats.totalVolume)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalChart;