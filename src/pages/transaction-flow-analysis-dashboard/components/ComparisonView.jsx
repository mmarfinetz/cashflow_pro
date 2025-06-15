// src/pages/transaction-flow-analysis-dashboard/components/ComparisonView.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ComparisonView = ({ dateRange, onClose }) => {
  const [comparisonPeriod, setComparisonPeriod] = useState('previousPeriod');
  
  const comparisonOptions = [
    { id: 'previousPeriod', label: 'Previous Period' },
    { id: 'sameLastYear', label: 'Same Period Last Year' },
    { id: 'custom', label: 'Custom Period' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Mock comparison data
  const comparisonData = {
    current: {
      period: 'Apr 1 - Apr 30, 2023',
      income: 125000,
      expenses: 89500,
      savings: 35500
    },
    previous: {
      period: 'Mar 1 - Mar 31, 2023',
      income: 118000,
      expenses: 92000,
      savings: 26000
    },
    // Calculate changes
    changes: {
      income: ((125000 - 118000) / 118000) * 100,
      expenses: ((89500 - 92000) / 92000) * 100,
      savings: ((35500 - 26000) / 26000) * 100
    }
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-success';
    if (value < 0) return 'text-error';
    return 'text-text-secondary';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return 'ArrowUp';
    if (value < 0) return 'ArrowDown';
    return 'Minus';
  };

  // Mock top changes
  const topChanges = [
    { category: 'Housing', type: 'expense', change: -5.2, current: 35000, previous: 36920 },
    { category: 'Food & Dining', type: 'expense', change: 12.5, current: 18000, previous: 16000 },
    { category: 'Business Income', type: 'income', change: 8.3, current: 32000, previous: 29550 },
    { category: 'Investments', type: 'income', change: 33.3, current: 8000, previous: 6000 }
  ].sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary">Period Comparison</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
          title="Close comparison"
        >
          <Icon name="X" size={18} />
        </button>
      </div>
      
      <div className="p-6">
        {/* Comparison Controls */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-sm font-medium text-text-secondary">Compare current with:</div>
            <div className="flex">
              {comparisonOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setComparisonPeriod(option.id)}
                  className={`px-3 py-1 text-sm rounded-lg mr-2 ${comparisonPeriod === option.id 
                    ? 'bg-primary-50 text-primary border border-primary-200' :'bg-gray-100 hover:bg-gray-200 text-text-secondary'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { label: 'Total Income', value: comparisonData.current.income, previous: comparisonData.previous.income, change: comparisonData.changes.income, icon: 'TrendingUp' },
            { label: 'Total Expenses', value: comparisonData.current.expenses, previous: comparisonData.previous.expenses, change: comparisonData.changes.expenses, icon: 'TrendingDown' },
            { label: 'Net Savings', value: comparisonData.current.savings, previous: comparisonData.previous.savings, change: comparisonData.changes.savings, icon: 'Wallet' }
          ].map((item, index) => (
            <div key={index} className="p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={item.icon} size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">{item.label}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full flex items-center ${item.change > 0 ? 'bg-success/10' : 'bg-error/10'}`}>
                  <Icon 
                    name={getChangeIcon(item.change)} 
                    size={12} 
                    className={getChangeColor(item.change)}
                  />
                  <span className={`ml-1 ${getChangeColor(item.change)}`}>
                    {formatPercentage(item.change)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="text-lg font-semibold text-text-primary">
                  {formatCurrency(item.value)}
                </div>
                <div className="text-xs text-text-secondary">
                  vs {formatCurrency(item.previous)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Periods */}
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-6">
          <div className="text-sm">
            <span className="text-text-secondary">Current: </span>
            <span className="text-text-primary font-medium">{comparisonData.current.period}</span>
          </div>
          <Icon name="ArrowRight" size={16} className="text-text-secondary" />
          <div className="text-sm">
            <span className="text-text-secondary">Previous: </span>
            <span className="text-text-primary font-medium">{comparisonData.previous.period}</span>
          </div>
        </div>

        {/* Top Changes */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">Biggest Changes</h3>
          <div className="space-y-4">
            {topChanges.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-gray-50 transition-smooth">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-success/10' : 'bg-error/10'}`}
                  >
                    <Icon 
                      name={item.type === 'income' ? 'TrendingUp' : 'TrendingDown'} 
                      size={16} 
                      className={item.type === 'income' ? 'text-success' : 'text-error'}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-text-primary">{item.category}</div>
                    <div className="text-xs text-text-secondary capitalize">{item.type}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Icon 
                      name={getChangeIcon(item.change)} 
                      size={14} 
                      className={getChangeColor(item.change)}
                    />
                    <span className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                      {formatPercentage(item.change)}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary">
                    {formatCurrency(item.current)} vs {formatCurrency(item.previous)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;