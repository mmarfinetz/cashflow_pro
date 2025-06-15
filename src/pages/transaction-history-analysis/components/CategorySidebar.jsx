import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const CategorySidebar = ({ categories, transactions }) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Calculate category totals
  const categoryTotals = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category === category.name);
    const total = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const count = categoryTransactions.length;
    
    // Calculate subcategory totals
    const subcategoryTotals = category.subcategories.map(subcategory => {
      const subcategoryTransactions = categoryTransactions.filter(t => t.subcategory === subcategory);
      const subcategoryTotal = subcategoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const subcategoryCount = subcategoryTransactions.length;
      
      return {
        name: subcategory,
        total: subcategoryTotal,
        count: subcategoryCount,
        percentage: total > 0 ? (subcategoryTotal / total) * 100 : 0
      };
    }).filter(sub => sub.count > 0);

    return {
      ...category,
      total,
      count,
      subcategories: subcategoryTotals,
      percentage: transactions.length > 0 ? (count / transactions.length) * 100 : 0
    };
  }).filter(cat => cat.count > 0);

  const totalAmount = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <div className="w-80 bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Category Analysis</h3>
        <p className="text-sm text-text-secondary">
          {transactions.length} transactions • {formatAmount(totalAmount)} total
        </p>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {categoryTotals.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="PieChart" size={48} className="mx-auto text-text-secondary mb-3" />
            <p className="text-text-secondary">No transactions found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categoryTotals.map((category) => (
              <div key={category.id} className="p-4">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between hover:bg-gray-50 -m-2 p-2 rounded-lg transition-smooth"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary">
                        {category.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {category.count} transactions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        {formatAmount(category.total)}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {category.percentage.toFixed(1)}%
                      </p>
                    </div>
                    
                    {category.subcategories.length > 0 && (
                      <Icon
                        name="ChevronDown"
                        size={16}
                        className={`text-text-secondary transition-transform ${
                          expandedCategories.has(category.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                </button>

                {/* Progress Bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: category.color,
                      width: `${totalAmount > 0 ? (category.total / totalAmount) * 100 : 0}%`
                    }}
                  ></div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) && category.subcategories.length > 0 && (
                  <div className="mt-3 ml-4 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-2 h-2 rounded-full opacity-70"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="text-xs text-text-secondary">
                            {subcategory.name}
                          </span>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs font-medium text-text-primary">
                            {formatAmount(subcategory.total)}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {subcategory.count} txns
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Management Actions */}
      <div className="p-4 border-t border-border bg-gray-50">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-smooth">
            <Icon name="Plus" size={16} />
            <span>Add Category</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-smooth">
            <Icon name="Edit" size={16} />
            <span>Manage Categories</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-smooth">
            <Icon name="Download" size={16} />
            <span>Export Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;