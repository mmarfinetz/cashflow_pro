import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FilterBar = ({ 
  filters, 
  onFiltersChange, 
  categories, 
  accounts, 
  activeFiltersCount 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const handleDateRangeChange = (field, value) => {
    const newFilters = {
      ...tempFilters,
      dateRange: {
        ...tempFilters.dateRange,
        [field]: value ? new Date(value) : null
      }
    };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleCategoryToggle = (categoryName) => {
    const newCategories = tempFilters.categories.includes(categoryName)
      ? tempFilters.categories.filter(c => c !== categoryName)
      : [...tempFilters.categories, categoryName];
    
    const newFilters = {
      ...tempFilters,
      categories: newCategories
    };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAccountToggle = (accountId) => {
    const newAccounts = tempFilters.accounts.includes(accountId)
      ? tempFilters.accounts.filter(a => a !== accountId)
      : [...tempFilters.accounts, accountId];
    
    const newFilters = {
      ...tempFilters,
      accounts: newAccounts
    };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmountRangeChange = (field, value) => {
    const newFilters = {
      ...tempFilters,
      amountRange: {
        ...tempFilters.amountRange,
        [field]: parseFloat(value) || 0
      }
    };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchChange = (value) => {
    const newFilters = {
      ...tempFilters,
      searchTerm: value
    };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      dateRange: { start: null, end: null },
      categories: [],
      amountRange: { min: 0, max: 10000 },
      accounts: [],
      searchTerm: ''
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-6">
      {/* Basic Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={tempFilters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={formatDate(tempFilters.dateRange.start)}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
          />
          <span className="text-text-secondary">to</span>
          <input
            type="date"
            value={formatDate(tempFilters.dateRange.end)}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-gray-50 transition-smooth"
        >
          <Icon name="Filter" size={16} />
          <span className="text-sm font-medium">
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </span>
          <Icon 
            name="ChevronDown" 
            size={14} 
            className={`transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.name)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium transition-smooth
                    ${tempFilters.categories.includes(category.name)
                      ? 'text-white' :'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }
                  `}
                  style={{
                    backgroundColor: tempFilters.categories.includes(category.name) 
                      ? category.color 
                      : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Min Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  min="0"
                  value={tempFilters.amountRange.min}
                  onChange={(e) => handleAmountRangeChange('min', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Max Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
                <input
                  type="number"
                  min="0"
                  value={tempFilters.amountRange.max}
                  onChange={(e) => handleAmountRangeChange('max', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
                />
              </div>
            </div>
          </div>

          {/* Accounts */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Accounts</label>
            <div className="flex flex-wrap gap-2">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleAccountToggle(account.id)}
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium border transition-smooth
                    ${tempFilters.accounts.includes(account.id)
                      ? 'bg-primary text-white border-primary' :'bg-gray-100 text-text-secondary border-border hover:bg-gray-200'
                    }
                  `}
                >
                  {account.name}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-2 px-4 py-2 text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="X" size={14} />
                <span className="text-sm">Clear all filters</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          {tempFilters.categories.map((category) => (
            <div
              key={category}
              className="flex items-center space-x-1 px-2 py-1 bg-primary-50 text-primary text-xs rounded-full"
            >
              <span>{category}</span>
              <button
                onClick={() => handleCategoryToggle(category)}
                className="hover:bg-primary-100 rounded-full p-0.5 transition-smooth"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          ))}
          
          {tempFilters.accounts.map((accountId) => {
            const account = accounts.find(a => a.id === accountId);
            return (
              <div
                key={accountId}
                className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
              >
                <span>{account?.name}</span>
                <button
                  onClick={() => handleAccountToggle(accountId)}
                  className="hover:bg-blue-100 rounded-full p-0.5 transition-smooth"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            );
          })}
          
          {tempFilters.searchTerm && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-text-secondary text-xs rounded-full">
              <span>"{tempFilters.searchTerm}"</span>
              <button
                onClick={() => handleSearchChange('')}
                className="hover:bg-gray-200 rounded-full p-0.5 transition-smooth"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;