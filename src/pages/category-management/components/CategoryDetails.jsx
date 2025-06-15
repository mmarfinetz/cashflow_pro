import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const CategoryDetails = ({
  category,
  colorPalette,
  onSave,
  onDelete,
  onCancel,
  isNew
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981',
    budget: '',
    type: 'expense'
  });
  const [errors, setErrors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || '#10B981',
        budget: category.budget ? category.budget.toString() : '',
        type: category.type || 'expense'
      });
      setErrors({});
    }
  }, [category]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const categoryData = {
        ...category,
        name: formData.name.trim(),
        color: formData.color,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        type: formData.type
      };
      onSave(categoryData);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      onDelete(category.id);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!category) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="text-center py-12">
          <Icon name="MousePointer" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">Select a Category</h3>
          <p className="text-text-secondary">
            Choose a category from the list to view and edit its details
          </p>
        </div>
      </div>
    );
  }

  const budgetPercentage = category.budget && category.totalAmount 
    ? Math.min((category.totalAmount / category.budget) * 100, 100)
    : 0;

  const isOverBudget = category.budget && category.totalAmount > category.budget;

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">
            {isNew ? 'Add New Category' : 'Category Details'}
          </h2>
          {!isNew && !category.isSystem && (
            <button
              onClick={handleDelete}
              className="p-2 text-error hover:bg-red-50 rounded-lg transition-smooth"
              title="Delete category"
            >
              <Icon name="Trash2" size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`
                w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
                ${errors.name ? 'border-error' : 'border-border'}
              `}
              placeholder="Enter category name"
              disabled={category.isSystem}
            />
            {errors.name && (
              <p className="text-error text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mr-2"
                  disabled={category.isSystem}
                />
                <span className="text-sm text-text-primary">Income</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mr-2"
                  disabled={category.isSystem}
                />
                <span className="text-sm text-text-primary">Expense</span>
              </label>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Category Color
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-10 h-10 rounded-lg border-2 border-white shadow-sm"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-text-secondary">{formData.color}</span>
            </div>
            
            {showColorPicker && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-5 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, color });
                        setShowColorPicker(false);
                      }}
                      className={`
                        w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110
                        ${formData.color === color ? 'border-text-primary' : 'border-white'}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Budget */}
          {formData.type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Monthly Budget (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className={`
                    w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent
                    ${errors.budget ? 'border-error' : 'border-border'}
                  `}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.budget && (
                <p className="text-error text-sm mt-1">{errors.budget}</p>
              )}
            </div>
          )}

          {/* Statistics (for existing categories) */}
          {!isNew && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-text-primary">Statistics</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="Receipt" size={14} className="text-text-secondary" />
                    <span className="text-xs text-text-secondary">Transactions</span>
                  </div>
                  <p className="text-lg font-semibold text-text-primary">
                    {category.transactionCount}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon name="DollarSign" size={14} className="text-text-secondary" />
                    <span className="text-xs text-text-secondary">Total Amount</span>
                  </div>
                  <p className={`
                    text-lg font-semibold
                    ${category.type === 'income' ? 'text-success' : 'text-text-primary'}
                  `}>
                    {formatAmount(category.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Budget Progress */}
              {category.budget && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">Budget Progress</span>
                    <span className={`
                      text-sm font-medium
                      ${isOverBudget ? 'text-error' : 'text-text-secondary'}
                    `}>
                      {budgetPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`
                        h-2 rounded-full transition-all duration-300
                        ${isOverBudget 
                          ? 'bg-gradient-to-r from-warning to-error' :'bg-gradient-to-r from-primary to-primary-600'
                        }
                      `}
                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>{formatAmount(category.totalAmount)} spent</span>
                    <span>{formatAmount(category.budget)} budget</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-border">
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-smooth"
            >
              {isNew ? 'Create Category' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-primary py-2 px-4 rounded-lg transition-smooth"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryDetails;