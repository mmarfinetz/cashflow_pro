import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BulkActionBar = ({ 
  selectedCount, 
  categories, 
  onBulkCategoryUpdate, 
  onClearSelection 
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleCategorySelect = (categoryName) => {
    onBulkCategoryUpdate(categoryName);
    setShowCategoryDropdown(false);
  };

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {selectedCount} transaction{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Category Update */}
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-gray-50 transition-smooth"
            >
              <Icon name="Tag" size={16} />
              <span className="text-sm font-medium">Update Category</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            {showCategoryDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg elevation-3 z-10">
                <div className="p-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.name)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-smooth"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm text-text-primary">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Selected */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-gray-50 transition-smooth">
            <Icon name="Download" size={16} />
            <span className="text-sm font-medium">Export Selected</span>
          </button>

          {/* Delete Selected */}
          <button className="flex items-center space-x-2 px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-smooth">
            <Icon name="Trash2" size={16} />
            <span className="text-sm font-medium">Delete</span>
          </button>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-smooth"
          >
            <Icon name="X" size={16} />
            <span className="text-sm font-medium">Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;