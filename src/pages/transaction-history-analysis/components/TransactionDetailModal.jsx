import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TransactionDetailModal = ({ 
  transaction, 
  categories, 
  onClose, 
  onCategoryUpdate 
}) => {
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(transaction.category);

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCategoryUpdate = () => {
    if (selectedCategory !== transaction.category) {
      onCategoryUpdate(transaction.id, selectedCategory);
    }
    setIsEditingCategory(false);
  };

  const currentCategory = categories.find(c => c.name === transaction.category);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-lg w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Transaction Details</h3>
              <p className="text-sm text-text-secondary mt-1">
                {formatDate(transaction.date)} at {formatTime(transaction.date)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-lg transition-smooth"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount */}
          <div className="text-center py-4">
            <div
              className={`text-3xl font-bold mb-2 ${
                transaction.amount >= 0 ? 'text-success' : 'text-text-primary'
              }`}
            >
              {formatAmount(transaction.amount)}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  transaction.amount >= 0 ? 'bg-success' : 'bg-error'
                }`}
              ></div>
              <span className="text-sm text-text-secondary">
                {transaction.amount >= 0 ? 'Income' : 'Expense'}
              </span>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Description
              </label>
              <p className="text-text-primary font-medium">{transaction.description}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Merchant
              </label>
              <p className="text-text-primary">{transaction.merchant}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Account
              </label>
              <p className="text-text-primary">{transaction.account}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Reference
              </label>
              <p className="text-text-primary font-mono text-sm">{transaction.reference}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-text-primary capitalize">{transaction.status}</span>
              </div>
            </div>
          </div>

          {/* Category Management */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-text-secondary">
                Category
              </label>
              {!isEditingCategory && (
                <button
                  onClick={() => setIsEditingCategory(true)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-primary hover:bg-primary-50 rounded transition-smooth"
                >
                  <Icon name="Edit" size={12} />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditingCategory ? (
              <div className="space-y-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCategoryUpdate}
                    className="flex items-center space-x-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-600 transition-smooth"
                  >
                    <Icon name="Check" size={14} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCategory(false);
                      setSelectedCategory(transaction.category);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 text-text-secondary text-sm hover:text-text-primary transition-smooth"
                  >
                    <Icon name="X" size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: currentCategory?.color || '#6B7280' }}
                ></div>
                <div>
                  <p className="text-text-primary font-medium">{transaction.category}</p>
                  <p className="text-xs text-text-secondary">{transaction.subcategory}</p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Actions */}
          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition-smooth">
                <Icon name="Flag" size={16} />
                <span className="text-sm font-medium">Flag Transaction</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-border rounded-lg hover:bg-gray-50 transition-smooth">
                <Icon name="MessageSquare" size={16} />
                <span className="text-sm font-medium">Add Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-smooth"
            >
              Close
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-smooth">
              <Icon name="Download" size={16} />
              <span>Export Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;