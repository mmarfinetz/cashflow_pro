// src/pages/transaction-flow-analysis-dashboard/components/FlowControls.jsx
import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const FlowControls = ({ 
  viewMode, 
  onViewModeChange, 
  amountThreshold, 
  onThresholdChange,
  onFullscreenToggle,
  isFullScreen
}) => {
  const [isThresholdMenuOpen, setIsThresholdMenuOpen] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(amountThreshold);

  const viewModes = [
    { id: 'flow', label: 'Flow View', icon: 'GitBranch' },
    { id: 'detailed', label: 'Detailed', icon: 'ListTree' },
    { id: 'simple', label: 'Simple', icon: 'Minimize2' }
  ];

  const handleThresholdApply = () => {
    onThresholdChange(tempThreshold);
    setIsThresholdMenuOpen(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getThresholdLabel = () => {
    if (amountThreshold === 0) return 'No Threshold';
    return `> ${formatCurrency(amountThreshold)}`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        {viewModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-smooth ${viewMode === mode.id 
              ? 'bg-primary-50 text-primary' : 'hover:bg-gray-100 text-text-secondary'}`}
            title={mode.label}
          >
            <Icon name={mode.icon} size={16} />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative">
          <button
            onClick={() => setIsThresholdMenuOpen(!isThresholdMenuOpen)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-smooth"
          >
            <Icon name="Filter" size={16} />
            <span>{getThresholdLabel()}</span>
            <Icon name="ChevronDown" size={14} />
          </button>

          {isThresholdMenuOpen && (
            <div className="absolute right-0 top-full mt-2 bg-surface border border-border rounded-lg p-4 shadow-lg z-10 w-64">
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Amount Threshold
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-text-secondary">$0</span>
                  <span className="text-sm font-medium text-text-primary">{formatCurrency(tempThreshold)}</span>
                  <span className="text-xs text-text-secondary">$10,000+</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleThresholdApply}
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-smooth"
                >
                  Apply
                </button>
                <button
                  onClick={() => {
                    setTempThreshold(0);
                    setIsThresholdMenuOpen(false);
                    onThresholdChange(0);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-primary font-medium py-2 px-4 rounded-lg transition-smooth"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {!isFullScreen && (
          <button
            onClick={onFullscreenToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
            title="Enter fullscreen"
          >
            <Icon name="Maximize2" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FlowControls;