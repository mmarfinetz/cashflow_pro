import React from 'react';
import Icon from 'components/AppIcon';

const CategoryTree = ({
  categories,
  selectedCategory,
  expandedCategories,
  selectedCategories,
  draggedCategory,
  onCategorySelect,
  onCategoryToggle,
  onBulkSelect,
  onDragStart,
  onDragEnd,
  onDrop,
  isMobile
}) => {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const CategoryItem = ({ category, level = 0, isChild = false }) => {
    const isExpanded = expandedCategories.has(category.id);
    const isSelected = selectedCategory?.id === category.id;
    const isBulkSelected = selectedCategories.has(category.id);
    const isDragging = draggedCategory?.id === category.id;
    const hasChildren = category.children && category.children.length > 0;

    const budgetPercentage = category.budget && category.totalAmount 
      ? Math.min((category.totalAmount / category.budget) * 100, 100)
      : 0;

    const isOverBudget = category.budget && category.totalAmount > category.budget;

    return (
      <div className={`${level > 0 ? 'ml-6' : ''}`}>
        <div
          className={`
            group flex items-center p-3 rounded-lg cursor-pointer transition-smooth border
            ${isSelected 
              ? 'bg-primary-50 border-primary-200 shadow-sm' 
              : 'border-transparent hover:bg-gray-50 hover:border-border'
            }
            ${isDragging ? 'opacity-50' : ''}
            ${isChild ? 'bg-gray-25' : ''}
          `}
          draggable={!category.isSystem && !isMobile}
          onDragStart={() => !isMobile && onDragStart(category)}
          onDragEnd={() => !isMobile && onDragEnd()}
          onDragOver={handleDragOver}
          onDrop={() => !isMobile && onDrop(category)}
          onClick={() => onCategorySelect(category)}
        >
          {/* Bulk Selection Checkbox */}
          {!category.isSystem && (
            <div
              className="mr-3 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onBulkSelect(category.id);
              }}
            >
              <div className={`
                w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer transition-smooth
                ${isBulkSelected 
                  ? 'bg-primary border-primary' :'border-gray-300 hover:border-primary'
                }
              `}>
                {isBulkSelected && (
                  <Icon name="Check" size={12} color="white" strokeWidth={3} />
                )}
              </div>
            </div>
          )}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              className="mr-2 p-1 rounded hover:bg-gray-100 transition-smooth"
              onClick={(e) => {
                e.stopPropagation();
                onCategoryToggle(category.id);
              }}
            >
              <Icon 
                name="ChevronRight" 
                size={16} 
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          )}

          {/* Category Color */}
          <div
            className="w-4 h-4 rounded-full mr-3 border-2 border-white shadow-sm"
            style={{ backgroundColor: category.color }}
          />

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <h3 className={`
                  font-medium truncate
                  ${isChild ? 'text-sm text-text-secondary' : 'text-text-primary'}
                `}>
                  {category.name}
                </h3>
                
                {category.isSystem && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    System
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <span className="text-text-secondary">
                  {category.transactionCount} transactions
                </span>
                <span className={`
                  font-medium
                  ${category.type === 'income' ? 'text-success' : 'text-text-primary'}
                `}>
                  {formatAmount(category.totalAmount)}
                </span>
              </div>
            </div>

            {/* Budget Progress */}
            {category.budget && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-secondary">
                    Budget: {formatAmount(category.budget)}
                  </span>
                  <span className={`
                    font-medium
                    ${isOverBudget ? 'text-error' : 'text-text-secondary'}
                  `}>
                    {budgetPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
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
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isMobile && !category.isSystem && (
              <button
                className="p-1 rounded hover:bg-gray-100 transition-smooth"
                title="Drag to reorder"
              >
                <Icon name="GripVertical" size={14} className="text-text-secondary" />
              </button>
            )}
            
            <button
              className="p-1 rounded hover:bg-gray-100 transition-smooth"
              onClick={(e) => {
                e.stopPropagation();
                onCategorySelect(category);
              }}
              title="Edit category"
            >
              <Icon name="Edit2" size={14} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Child Categories */}
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.children.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                level={level + 1}
                isChild={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="FolderOpen" size={48} className="text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No categories found</h3>
        <p className="text-text-secondary">
          {categories.length === 0 ? 'Create your first category to get started' : 'Try adjusting your search terms'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryTree;