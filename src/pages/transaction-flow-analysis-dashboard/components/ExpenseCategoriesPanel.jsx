// src/pages/transaction-flow-analysis-dashboard/components/ExpenseCategoriesPanel.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExpenseCategoriesPanel = ({ expenseCategories, selectedCategories, onCategoryToggle, isLoading }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

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

  // Calculate total expenses
  const totalExpenses = expenseCategories.reduce((sum, category) => sum + category.value, 0);

  // Calculate percentages for each expense category
  const categoriesWithPercentages = expenseCategories.map(category => ({
    ...category,
    percentage: (category.value / totalExpenses) * 100,
    // Mock subcategories data (in a real app, this would come from the backend)
    subcategories: [
      { name: `${category.name} - Primary`, value: category.value * 0.6 },
      { name: `${category.name} - Secondary`, value: category.value * 0.3 },
      { name: `${category.name} - Other`, value: category.value * 0.1 }
    ]
  })).sort((a, b) => b.value - a.value); // Sort by value, highest first

  const getCategoryColor = (categoryId) => {
    const colors = {
      'housing': '#EF4444',
      'transportation': '#F59E0B', 
      'food': '#8B5CF6',
      'shopping': '#06B6D4',
      'healthcare': '#84CC16',
      'entertainment': '#EC4899'
    };
    
    return colors[categoryId] || '#6B7280';
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Expense Categories</h3>
          <Icon name="TrendingDown" size={20} className="text-error" />
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
        <h3 className="text-lg font-semibold text-text-primary">Expense Categories</h3>
        <Icon name="TrendingDown" size={20} className="text-error" />
      </div>
      
      {categoriesWithPercentages.length === 0 ? (
        <div className="text-center py-6">
          <Icon name="CreditCard" size={32} className="text-text-secondary mx-auto mb-2" />
          <p className="text-text-secondary">No expense categories available</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="pb-2 border-b border-border-light">
            <div className="text-sm text-text-secondary">Total Expenses</div>
            <div className="text-xl font-semibold text-text-primary">{formatCurrency(totalExpenses)}</div>
          </div>

          <div className="space-y-4">
            {categoriesWithPercentages.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              const isFiltered = selectedCategories.length > 0;
              const isExpanded = expandedCategory === category.id;
              const categoryColor = getCategoryColor(category.id);
              
              return (
                <div key={category.id} className={`rounded-lg transition-smooth ${isExpanded ? 'bg-gray-50 p-4 -mx-4' : ''}`}>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onCategoryToggle && onCategoryToggle(category.id)}
                      className={`
                        flex items-center space-x-3 py-2 transition-smooth
                        ${isFiltered && !isSelected ? 'opacity-50' : 'opacity-100'}
                      `}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColor }}
                      ></div>
                      <span className="text-sm font-medium text-text-primary">
                        {category.name}
                      </span>
                      {isSelected && (
                        <Icon name="Check" size={14} className="text-primary" />
                      )}
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-text-primary">
                          {formatCurrency(category.value)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatPercentage(category.percentage)}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleCategoryExpand(category.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-smooth"
                      >
                        <Icon 
                          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-text-secondary"
                        />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress bar with animation */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: categoryColor
                      }}
                    ></div>
                  </div>
                  
                  {/* Subcategories - only visible when expanded */}
                  {isExpanded && (
                    <div className="mt-4 pl-6 space-y-3">
                      {category.subcategories.map((subcategory, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-2 h-2 rounded-full opacity-70"
                              style={{ backgroundColor: categoryColor }}
                            ></div>
                            <span className="text-xs text-text-secondary">
                              {subcategory.name}
                            </span>
                          </div>
                          
                          <div className="text-xs font-medium text-text-primary">
                            {formatCurrency(subcategory.value)}
                          </div>
                        </div>
                      ))}
                      
                      <div className="pt-2 mt-2 border-t border-border-light">
                        <button className="text-xs text-primary hover:text-primary-600 transition-smooth">
                          View all transactions
                        </button>
                      </div>
                    </div>
                  )}
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
      )}
    </div>
  );
};

export default ExpenseCategoriesPanel;