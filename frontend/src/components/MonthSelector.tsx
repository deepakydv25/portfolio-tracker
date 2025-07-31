// src/components/MonthSelector.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, Search, TrendingUp } from 'lucide-react';

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  selectedStock: string;
  availableStocks: string[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onStockChange: (stock: string) => void;
  onLoadData: () => void;
  isLoading?: boolean;
  hasData?: boolean;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedYear,
  selectedMonth,
  selectedStock,
  availableStocks,
  onYearChange,
  onMonthChange,
  onStockChange,
  onLoadData,
  isLoading = false,
  hasData = false
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  // Only show years from 2021 to current year (no future years)
  const years = Array.from({ length: currentYear - 2020 }, (_, i) => 2021 + i);
  
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Filter months based on selected year (don't show future months for current year)
  const availableMonths = selectedYear === currentYear 
    ? months.filter(month => month.value <= currentMonth)
    : months;

  const [isFormValid, setIsFormValid] = useState(false);

  // Check if the selected date is valid (not in future)
  useEffect(() => {
    const isFutureDate = selectedYear === currentYear && selectedMonth > currentMonth;
    const isValidSelection = selectedYear <= currentYear && !isFutureDate;
    setIsFormValid(isValidSelection);
  }, [selectedYear, selectedMonth, currentYear, currentMonth]);

  const handleLoadData = () => {
    if (isFormValid && !isLoading) {
      onLoadData();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Select Historical Period</h3>
        </div>
        <div className="text-sm text-gray-500">
          {hasData ? `Data loaded for ${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}` : 'No data loaded'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Year Selector */}
        <div>
          <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {availableMonths.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        {/* Stock Selector */}
        <div>
          <label htmlFor="stock-select" className="block text-sm font-medium text-gray-700 mb-2">
            Stock (Optional)
          </label>
          <select
            id="stock-select"
            value={selectedStock}
            onChange={(e) => onStockChange(e.target.value)}
            disabled={isLoading}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Stocks</option>
            {availableStocks.map(stock => (
              <option key={stock} value={stock}>{stock}</option>
            ))}
          </select>
        </div>

        {/* Load Data Button */}
        <div className="flex items-end">
          <button
            onClick={handleLoadData}
            disabled={!isFormValid || isLoading}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
              isFormValid && !isLoading
                ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Loading...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Load Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info Messages */}
      <div className="text-sm text-gray-600">
        {!isFormValid && (
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-md">
            <Calendar className="h-4 w-4" />
            <span>Please select a valid date (not in the future)</span>
          </div>
        )}
        
        {selectedStock && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-md mt-2">
            <TrendingUp className="h-4 w-4" />
            <span>Filtering data for: <strong>{selectedStock}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthSelector;