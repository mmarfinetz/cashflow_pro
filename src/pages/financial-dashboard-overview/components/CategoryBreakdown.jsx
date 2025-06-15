import React from 'react';
import Icon from 'components/AppIcon';

const CategoryBreakdown = ({ 
  incomeStreams, 
  expenseCategories, 
  selectedCategories, 
  onCategoryToggle, 
  isLoading 
}) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((section) => (
          <div key={section} className="bg-surface rounded-lg border border-border p-6">
            <div className="animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Income Breakdown */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Income Sources</h3>
          <Icon name="TrendingUp" size={20} className="text-success" />
        </div>
        
        <div className="space-y-3">
          {incomeStreams.map((stream) => (
            <div key={stream.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium text-text-primary">{stream.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-text-primary">
                    {formatCurrency(stream.amount)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {formatPercentage(stream.percentage)}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stream.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Expense Categories</h3>
          <Icon name="TrendingDown" size={20} className="text-error" />
        </div>
        
        <div className="space-y-3">
          {expenseCategories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const isFiltered = selectedCategories.length > 0;
            
            return (
              <div key={category.id} className="group">
                <button
                  onClick={() => onCategoryToggle && onCategoryToggle(category.id)}
                  className={`
                    w-full text-left transition-smooth
                    ${isFiltered && !isSelected ? 'opacity-50' : 'opacity-100'}
                    ${onCategoryToggle ? 'hover:bg-gray-50 rounded-lg p-2 -m-2' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-text-primary">
                        {category.name}
                      </span>
                      {isSelected && (
                        <Icon name="Check" size={14} className="text-primary" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-text-primary">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {formatPercentage(category.percentage)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: category.color 
                      }}
                    ></div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Filter Controls */}
        {selectedCategories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-light">
            <button
              onClick={() => selectedCategories.forEach(id => onCategoryToggle(id))}
              className="flex items-center space-x-2 text-sm text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="X" size={14} />
              <span>Clear filters ({selectedCategories.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Summary</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Total Categories</span>
            <span className="text-sm font-medium text-text-primary">
              {expenseCategories.length}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Largest Expense</span>
            <span className="text-sm font-medium text-text-primary">
              {expenseCategories.reduce((max, cat) => 
                cat.amount > max.amount ? cat : max, expenseCategories[0]
              )?.name}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Average per Category</span>
            <span className="text-sm font-medium text-text-primary">
              {formatCurrency(
                expenseCategories.reduce((sum, cat) => sum + cat.amount, 0) / expenseCategories.length
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdown;