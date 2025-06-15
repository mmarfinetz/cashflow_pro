import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const DateRangePicker = ({ selectedRange, customRange, onRangeChange }) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempCustomRange, setTempCustomRange] = useState(customRange);

  const predefinedRanges = [
    { id: 'last7days', label: 'Last 7 Days', icon: 'Calendar' },
    { id: 'last30days', label: 'Last 30 Days', icon: 'Calendar' },
    { id: 'last90days', label: 'Last 90 Days', icon: 'Calendar' },
    { id: 'thisMonth', label: 'This Month', icon: 'Calendar' },
    { id: 'lastMonth', label: 'Last Month', icon: 'Calendar' },
    { id: 'thisYear', label: 'This Year', icon: 'Calendar' },
    { id: 'custom', label: 'Custom Range', icon: 'CalendarRange' }
  ];

  const handleRangeSelect = (rangeId) => {
    if (rangeId === 'custom') {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
      onRangeChange(rangeId);
    }
  };

  const handleCustomRangeApply = () => {
    if (tempCustomRange.start && tempCustomRange.end) {
      onRangeChange('custom', tempCustomRange);
      setShowCustomPicker(false);
    }
  };

  const handleCustomRangeCancel = () => {
    setTempCustomRange(customRange);
    setShowCustomPicker(false);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const getCurrentRangeLabel = () => {
    if (selectedRange === 'custom' && customRange.start && customRange.end) {
      const startDate = new Date(customRange.start).toLocaleDateString();
      const endDate = new Date(customRange.end).toLocaleDateString();
      return `${startDate} - ${endDate}`;
    }
    return predefinedRanges.find(range => range.id === selectedRange)?.label || 'Select Range';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Date Range</h3>
        <Icon name="Calendar" size={20} className="text-text-secondary" />
      </div>

      {!showCustomPicker ? (
        <div className="space-y-2">
          {predefinedRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handleRangeSelect(range.id)}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-smooth
                ${selectedRange === range.id 
                  ? 'bg-primary-50 border border-primary-200 text-primary' :'hover:bg-gray-50 text-text-secondary'
                }
              `}
            >
              <Icon name={range.icon} size={16} />
              <span className="text-sm font-medium">{range.label}</span>
              {selectedRange === range.id && (
                <Icon name="Check" size={16} className="ml-auto" />
              )}
            </button>
          ))}
          
          {selectedRange === 'custom' && customRange.start && customRange.end && (
            <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="text-xs text-primary font-medium mb-1">Selected Range:</div>
              <div className="text-sm text-primary">{getCurrentRangeLabel()}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formatDateForInput(tempCustomRange.start)}
                onChange={(e) => setTempCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formatDateForInput(tempCustomRange.end)}
                onChange={(e) => setTempCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleCustomRangeApply}
              disabled={!tempCustomRange.start || !tempCustomRange.end}
              className="flex-1 bg-primary hover:bg-primary-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-smooth"
            >
              Apply
            </button>
            <button
              onClick={handleCustomRangeCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-primary font-medium py-2 px-4 rounded-lg transition-smooth"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;