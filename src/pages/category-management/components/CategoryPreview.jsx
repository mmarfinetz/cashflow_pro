import React from 'react';
import Icon from 'components/AppIcon';

const CategoryPreview = ({ categories, onClose }) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalIncome = categories
    .filter(cat => cat.type === 'income')
    .reduce((total, cat) => total + cat.totalAmount + (cat.children?.reduce((childTotal, child) => childTotal + child.totalAmount, 0) || 0), 0);

  const totalExpenses = categories
    .filter(cat => cat.type === 'expense')
    .reduce((total, cat) => total + cat.totalAmount + (cat.children?.reduce((childTotal, child) => childTotal + child.totalAmount, 0) || 0), 0);

  const netCashflow = totalIncome - totalExpenses;

  const expenseCategories = categories
    .filter(cat => cat.type === 'expense')
    .flatMap(cat => cat.children || [])
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 6);

  const maxExpense = Math.max(...expenseCategories.map(cat => cat.totalAmount));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Dashboard Preview</h2>
            <p className="text-sm text-text-secondary mt-1">
              See how your category changes will appear in the dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-success to-emerald-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Total Income</p>
                  <p className="text-2xl font-bold">{formatAmount(totalIncome)}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} color="white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-error to-red-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatAmount(totalExpenses)}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingDown" size={24} color="white" />
                </div>
              </div>
            </div>

            <div className={`
              rounded-lg p-6 text-white
              ${netCashflow >= 0 
                ? 'bg-gradient-to-br from-primary to-primary-600' :'bg-gradient-to-br from-warning to-amber-600'
              }
            `}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${netCashflow >= 0 ? 'text-emerald-100' : 'text-amber-100'}`}>
                    Net Cashflow
                  </p>
                  <p className="text-2xl font-bold">{formatAmount(netCashflow)}</p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Icon name={netCashflow >= 0 ? "PiggyBank" : "AlertTriangle"} size={24} color="white" />
                </div>
              </div>
            </div>
          </div>

          {/* Sankey Diagram Preview */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Cashflow Visualization</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Income Sources */}
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-3">Income Sources</h4>
                <div className="space-y-3">
                  {categories
                    .filter(cat => cat.type === 'income')
                    .flatMap(cat => cat.children || [])
                    .map((income) => (
                      <div key={income.id} className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: income.color }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{income.name}</p>
                          <p className="text-xs text-text-secondary">{formatAmount(income.totalAmount)}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Flow Visualization */}
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mb-2">
                    <Icon name="ArrowRight" size={24} color="white" />
                  </div>
                  <p className="text-xs text-text-secondary">Cashflow</p>
                </div>
              </div>

              {/* Expense Categories */}
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-3">Expense Categories</h4>
                <div className="space-y-3">
                  {expenseCategories.map((expense) => {
                    const percentage = (expense.totalAmount / maxExpense) * 100;
                    return (
                      <div key={expense.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: expense.color }}
                            />
                            <span className="text-sm font-medium text-text-primary">{expense.name}</span>
                          </div>
                          <span className="text-xs text-text-secondary">{formatAmount(expense.totalAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="h-1 rounded-full"
                            style={{ 
                              backgroundColor: expense.color,
                              width: `${percentage}%`
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Breakdown */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Income Breakdown</h3>
              <div className="space-y-3">
                {categories
                  .filter(cat => cat.type === 'income')
                  .flatMap(cat => cat.children || [])
                  .map((income) => {
                    const percentage = totalIncome > 0 ? (income.totalAmount / totalIncome) * 100 : 0;
                    return (
                      <div key={income.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: income.color }}
                          />
                          <span className="text-sm font-medium text-text-primary">{income.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-success">{formatAmount(income.totalAmount)}</p>
                          <p className="text-xs text-text-secondary">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Expense Breakdown</h3>
              <div className="space-y-3">
                {expenseCategories.map((expense) => {
                  const percentage = totalExpenses > 0 ? (expense.totalAmount / totalExpenses) * 100 : 0;
                  const isOverBudget = expense.budget && expense.totalAmount > expense.budget;
                  return (
                    <div key={expense.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: expense.color }}
                        />
                        <span className="text-sm font-medium text-text-primary">{expense.name}</span>
                        {isOverBudget && (
                          <Icon name="AlertTriangle" size={12} className="text-warning" />
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isOverBudget ? 'text-error' : 'text-text-primary'}`}>
                          {formatAmount(expense.totalAmount)}
                        </p>
                        <p className="text-xs text-text-secondary">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPreview;