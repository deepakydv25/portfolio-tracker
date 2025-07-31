// src/components/StockTable.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';

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

interface StockTableProps {
  data: Stock[];
  title: string;
  isLoading?: boolean;
  showRefresh?: boolean;
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

const formatCurrency = (num: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(num);
};

const StockRow: React.FC<{ stock: Stock }> = ({ stock }) => {
  const isPositive = stock.day_change >= 0;
  
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {stock.symbol.substring(0, 2)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
            <div className="text-sm text-gray-500">{stock.date}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(stock.open)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="text-green-600 font-medium">{formatCurrency(stock.high)}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className="text-red-600 font-medium">{formatCurrency(stock.low)}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {formatCurrency(stock.close)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span className="font-medium">
            {isPositive ? '+' : ''}{formatCurrency(stock.day_change)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isPositive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {isPositive ? '+' : ''}{stock.day_change_pct.toFixed(2)}%
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2 text-gray-400" />
          {formatNumber(stock.volume)}
        </div>
      </td>
    </tr>
  );
};

const StockTable: React.FC<StockTableProps> = ({ data, title, isLoading, showRefresh = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            {title}
          </h2>
          <div className="text-sm text-gray-500">
            {data.length} stocks
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Open
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                High
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Low
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Close
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((stock, idx) => (
              <StockRow key={`${stock.symbol}-${stock.date}-${idx}`} stock={stock} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;