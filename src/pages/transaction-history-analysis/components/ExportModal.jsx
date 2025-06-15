import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportModal = ({ transactions, filters, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeFilters: true,
    includeSummary: true,
    dateRange: 'filtered'
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: 'FileText', description: 'Comma-separated values for spreadsheets' },
    { value: 'pdf', label: 'PDF', icon: 'FileText', description: 'Formatted report document' },
    { value: 'png', label: 'PNG', icon: 'Image', description: 'Chart visualization image' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock export logic
    console.log('Exporting transactions:', {
      format: exportFormat,
      options: exportOptions,
      transactionCount: transactions.length,
      filters
    });
    
    setIsExporting(false);
    onClose();
  };

  const handleOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Export Transactions</h3>
              <p className="text-sm text-text-secondary mt-1">
                Export {transactions.length} filtered transactions
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
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              {formatOptions.map((format) => (
                <label
                  key={format.value}
                  className={`
                    flex items-center p-3 border rounded-lg cursor-pointer transition-smooth
                    ${exportFormat === format.value
                      ? 'border-primary bg-primary-50' :'border-border hover:bg-gray-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format.value}
                    checked={exportFormat === format.value}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <div className="ml-3 flex items-center space-x-3">
                    <Icon name={format.icon} size={20} className="text-text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{format.label}</p>
                      <p className="text-xs text-text-secondary">{format.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Export Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeFilters}
                  onChange={(e) => handleOptionChange('includeFilters', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-text-primary">Include filter summary</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={exportOptions.includeSummary}
                  onChange={(e) => handleOptionChange('includeSummary', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <span className="ml-3 text-sm text-text-primary">Include category summary</span>
              </label>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Date Range
            </label>
            <select
              value={exportOptions.dateRange}
              onChange={(e) => handleOptionChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-smooth"
            >
              <option value="filtered">Current filtered results</option>
              <option value="all">All transactions</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="thisYear">This year</option>
            </select>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-text-primary mb-2">Export Preview</h4>
            <div className="text-xs text-text-secondary space-y-1">
              <p>• Format: {formatOptions.find(f => f.value === exportFormat)?.label}</p>
              <p>• Transactions: {transactions.length}</p>
              <p>• Date range: {exportOptions.dateRange.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
              {exportOptions.includeFilters && <p>• Filter summary included</p>}
              {exportOptions.includeSummary && <p>• Category summary included</p>}
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
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              {isExporting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;