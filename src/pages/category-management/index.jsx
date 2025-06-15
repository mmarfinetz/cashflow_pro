import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import CategoryTree from './components/CategoryTree';
import CategoryDetails from './components/CategoryDetails';
import BulkOperations from './components/BulkOperations';
import CategoryPreview from './components/CategoryPreview';

const CategoryManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set(['income', 'expenses']));
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [draggedCategory, setDraggedCategory] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const categories = [
    {
      id: 'income',
      name: 'Income',
      type: 'income',
      color: '#10B981',
      transactionCount: 45,
      totalAmount: 125000,
      budget: null,
      isSystem: true,
      children: [
        {
          id: 'salary',
          name: 'Salary & Wages',
          type: 'income',
          color: '#059669',
          transactionCount: 24,
          totalAmount: 85000,
          budget: null,
          parentId: 'income'
        },
        {
          id: 'business-income',
          name: 'Business Income',
          type: 'income',
          color: '#047857',
          transactionCount: 15,
          totalAmount: 32000,
          budget: null,
          parentId: 'income'
        },
        {
          id: 'investments',
          name: 'Investment Returns',
          type: 'income',
          color: '#065F46',
          transactionCount: 6,
          totalAmount: 8000,
          budget: null,
          parentId: 'income'
        }
      ]
    },
    {
      id: 'expenses',
      name: 'Expenses',
      type: 'expense',
      color: '#EF4444',
      transactionCount: 156,
      totalAmount: 89500,
      budget: 95000,
      isSystem: true,
      children: [
        {
          id: 'housing',
          name: 'Housing & Utilities',
          type: 'expense',
          color: '#DC2626',
          transactionCount: 28,
          totalAmount: 35000,
          budget: 38000,
          parentId: 'expenses'
        },
        {
          id: 'transportation',
          name: 'Transportation',
          type: 'expense',
          color: '#B91C1C',
          transactionCount: 22,
          totalAmount: 12500,
          budget: 15000,
          parentId: 'expenses'
        },
        {
          id: 'food-dining',
          name: 'Food & Dining',
          type: 'expense',
          color: '#991B1B',
          transactionCount: 45,
          totalAmount: 18000,
          budget: 20000,
          parentId: 'expenses'
        },
        {
          id: 'shopping',
          name: 'Shopping',
          type: 'expense',
          color: '#7F1D1D',
          transactionCount: 35,
          totalAmount: 15000,
          budget: 12000,
          parentId: 'expenses'
        },
        {
          id: 'healthcare',
          name: 'Healthcare',
          type: 'expense',
          color: '#450A0A',
          transactionCount: 12,
          totalAmount: 5500,
          budget: 6000,
          parentId: 'expenses'
        },
        {
          id: 'entertainment',
          name: 'Entertainment',
          type: 'expense',
          color: '#F59E0B',
          transactionCount: 14,
          totalAmount: 3500,
          budget: 4000,
          parentId: 'expenses'
        }
      ]
    }
  ];

  const colorPalette = [
    '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
    '#059669', '#2563EB', '#7C3AED', '#D97706', '#DC2626',
    '#0891B2', '#65A30D', '#EA580C', '#DB2777', '#4F46E5'
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (isMobileView) {
      setShowMobileDetails(true);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleBulkSelect = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setSelectedCategory({
      id: 'new',
      name: '',
      type: 'expense',
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      transactionCount: 0,
      totalAmount: 0,
      budget: null,
      isNew: true
    });
    if (isMobileView) {
      setShowMobileDetails(true);
    }
  };

  const handleSaveCategory = (categoryData) => {
    console.log('Saving category:', categoryData);
    setIsAddingCategory(false);
    setSelectedCategory(null);
    if (isMobileView) {
      setShowMobileDetails(false);
    }
  };

  const handleDeleteCategory = (categoryId) => {
    console.log('Deleting category:', categoryId);
    setSelectedCategory(null);
    if (isMobileView) {
      setShowMobileDetails(false);
    }
  };

  const handleDragStart = (category) => {
    setDraggedCategory(category);
  };

  const handleDragEnd = () => {
    setDraggedCategory(null);
  };

  const handleDrop = (targetCategory) => {
    if (draggedCategory && draggedCategory.id !== targetCategory.id) {
      console.log('Moving category:', draggedCategory.id, 'to:', targetCategory.id);
    }
    setDraggedCategory(null);
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    children: category.children?.filter(child =>
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []
  })).filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.children && category.children.length > 0)
  );

  const totalCategories = categories.reduce((total, cat) => 
    total + 1 + (cat.children?.length || 0), 0
  );

  const totalTransactions = categories.reduce((total, cat) => 
    total + cat.transactionCount + (cat.children?.reduce((childTotal, child) => 
      childTotal + child.transactionCount, 0) || 0), 0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 lg:px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                  <Icon name="Settings" size={18} color="white" strokeWidth={2} />
                </div>
                <h1 className="text-2xl font-semibold text-text-primary">Category Management</h1>
              </div>
              <p className="text-text-secondary">
                Customize transaction categories for accurate financial reporting and analysis
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition-smooth"
              >
                <Icon name="Eye" size={18} />
                <span className="hidden sm:inline">Preview Changes</span>
              </button>
              
              <button
                onClick={handleAddCategory}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-smooth"
              >
                <Icon name="Plus" size={18} />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Folder" size={16} className="text-primary" />
                <span className="text-sm text-text-secondary">Total Categories</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary mt-1">{totalCategories}</p>
            </div>
            
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Receipt" size={16} className="text-accent" />
                <span className="text-sm text-text-secondary">Transactions</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary mt-1">{totalTransactions}</p>
            </div>
            
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="CheckSquare" size={16} className="text-success" />
                <span className="text-sm text-text-secondary">Selected</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary mt-1">{selectedCategories.size}</p>
            </div>
            
            <div className="bg-surface rounded-lg p-4 border border-border">
              <div className="flex items-center space-x-2">
                <Icon name="Palette" size={16} className="text-warning" />
                <span className="text-sm text-text-secondary">Colors Used</span>
              </div>
              <p className="text-2xl font-semibold text-text-primary mt-1">
                {new Set(categories.flatMap(cat => [cat.color, ...(cat.children?.map(child => child.color) || [])])).size}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Bulk Operations */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          {selectedCategories.size > 0 && (
            <BulkOperations
              selectedCount={selectedCategories.size}
              onMerge={() => console.log('Merge categories')}
              onDelete={() => console.log('Delete categories')}
              onClearSelection={() => setSelectedCategories(new Set())}
            />
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Tree Panel */}
          <div className={`lg:col-span-2 ${isMobileView && showMobileDetails ? 'hidden' : ''}`}>
            <div className="bg-surface rounded-lg border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Category Hierarchy</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Drag and drop to reorganize categories
                </p>
              </div>
              
              <div className="p-4">
                <CategoryTree
                  categories={filteredCategories}
                  selectedCategory={selectedCategory}
                  expandedCategories={expandedCategories}
                  selectedCategories={selectedCategories}
                  draggedCategory={draggedCategory}
                  onCategorySelect={handleCategorySelect}
                  onCategoryToggle={handleCategoryToggle}
                  onBulkSelect={handleBulkSelect}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop}
                  isMobile={isMobileView}
                />
              </div>
            </div>
          </div>

          {/* Category Details Panel */}
          <div className={`${isMobileView && !showMobileDetails ? 'hidden' : ''}`}>
            {isMobileView && showMobileDetails && (
              <div className="mb-4">
                <button
                  onClick={() => setShowMobileDetails(false)}
                  className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <Icon name="ArrowLeft" size={18} />
                  <span>Back to Categories</span>
                </button>
              </div>
            )}
            
            <CategoryDetails
              category={selectedCategory}
              colorPalette={colorPalette}
              onSave={handleSaveCategory}
              onDelete={handleDeleteCategory}
              onCancel={() => {
                setSelectedCategory(null);
                setIsAddingCategory(false);
                if (isMobileView) {
                  setShowMobileDetails(false);
                }
              }}
              isNew={isAddingCategory}
            />
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <CategoryPreview
            categories={categories}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;