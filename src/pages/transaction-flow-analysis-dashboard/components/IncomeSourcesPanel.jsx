// src/pages/transaction-flow-analysis-dashboard/components/IncomeSourcesPanel.jsx
import React from 'react';
import Icon from 'components/AppIcon';

const IncomeSourcesPanel = ({ incomeSources, selectedSources, onSourceToggle, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    return `${percentage.toFixed(1)}%`;
  };

  // Calculate total income
  const totalIncome = incomeSources.reduce((sum, source) => sum + source.value, 0);

  // Calculate percentages for each income source
  const sourcesWithPercentages = incomeSources.map(source => ({
    ...source,
    percentage: (source.value / totalIncome) * 100
  })).sort((a, b) => b.value - a.value); // Sort by value, highest first

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Income Sources</h3>
          <Icon name="TrendingUp" size={20} className="text-success" />
        </div>
        
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Income Sources</h3>
        <Icon name="TrendingUp" size={20} className="text-success" />
      </div>
      
      {sourcesWithPercentages.length === 0 ? (
        <div className="text-center py-6">
          <Icon name="DollarSign" size={32} className="text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">No income sources available</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="pb-2 border-b border-border-light">
            <div className="text-sm text-text-secondary">Total Income</div>
            <div className="text-xl font-semibold text-text-primary">{formatCurrency(totalIncome)}</div>
          </div>

          <div className="space-y-3">
            {sourcesWithPercentages.map((source) => {
              const isSelected = selectedSources.includes(source.id);
              const isFiltered = selectedSources.length > 0;
              
              return (
                <div key={source.id} className="group">
                  <button
                    onClick={() => onSourceToggle && onSourceToggle(source.id)}
                    className={`
                      w-full text-left transition-smooth
                      ${isFiltered && !isSelected ? 'opacity-50' : 'opacity-100'}
                      ${onSourceToggle ? 'hover:bg-gray-50 rounded-lg p-2 -m-2' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium text-text-primary">
                          {source.name}
                        </span>
                        {isSelected && (
                          <Icon name="Check" size={14} className="text-primary" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-text-primary">
                          {formatCurrency(source.value)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatPercentage(source.percentage)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar with animation */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-primary to-primary-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Filter Controls */}
          {selectedSources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-light">
              <button
                onClick={() => selectedSources.forEach(id => onSourceToggle(id))}
                className="flex items-center space-x-2 text-sm text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={14} />
                <span>Clear filters ({selectedSources.length})</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomeSourcesPanel;