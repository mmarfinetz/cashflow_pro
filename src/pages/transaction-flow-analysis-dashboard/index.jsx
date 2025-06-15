// src/pages/transaction-flow-analysis-dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import FlowDiagram from './components/FlowDiagram';
import IncomeSourcesPanel from './components/IncomeSourcesPanel';
import ExpenseCategoriesPanel from './components/ExpenseCategoriesPanel';
import DateRangeFilter from './components/DateRangeFilter';
import FlowControls from './components/FlowControls';
import ComparisonView from './components/ComparisonView';

const TransactionFlowAnalysisDashboard = () => {
  const [dateRange, setDateRange] = useState('last30days');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [amountThreshold, setAmountThreshold] = useState(0);
  const [viewMode, setViewMode] = useState('flow'); // 'flow', 'detailed', 'simple'

  // Mock data for demonstration purposes
  const [flowData, setFlowData] = useState(null);

  useEffect(() => {
    // Simulate API loading
    setIsLoading(true);
    
    // Simulate API response delay
    const timer = setTimeout(() => {
      // Mock data structure for the flow diagram
      const mockData = {
        nodes: [
          // Income sources
          { id: 'salary', name: 'Salary & Wages', type: 'income', value: 85000 },
          { id: 'business', name: 'Business Income', type: 'income', value: 32000 },
          { id: 'investments', name: 'Investments', type: 'income', value: 8000 },
          
          // Expense categories
          { id: 'housing', name: 'Housing', type: 'expense', value: 35000 },
          { id: 'transportation', name: 'Transportation', type: 'expense', value: 12500 },
          { id: 'food', name: 'Food & Dining', type: 'expense', value: 18000 },
          { id: 'shopping', name: 'Shopping', type: 'expense', value: 15000 },
          { id: 'healthcare', name: 'Healthcare', type: 'expense', value: 5500 },
          { id: 'entertainment', name: 'Entertainment', type: 'expense', value: 3500 },
          
          // Savings
          { id: 'savings', name: 'Savings & Investments', type: 'savings', value: 35500 }
        ],
        links: [
          // From salary to expense categories
          { source: 'salary', target: 'housing', value: 25000 },
          { source: 'salary', target: 'transportation', value: 8000 },
          { source: 'salary', target: 'food', value: 12000 },
          { source: 'salary', target: 'shopping', value: 10000 },
          { source: 'salary', target: 'healthcare', value: 4000 },
          { source: 'salary', target: 'entertainment', value: 2000 },
          { source: 'salary', target: 'savings', value: 24000 },
          
          // From business income to expense categories
          { source: 'business', target: 'housing', value: 10000 },
          { source: 'business', target: 'transportation', value: 4500 },
          { source: 'business', target: 'food', value: 6000 },
          { source: 'business', target: 'shopping', value: 5000 },
          { source: 'business', target: 'healthcare', value: 1500 },
          { source: 'business', target: 'entertainment', value: 1500 },
          { source: 'business', target: 'savings', value: 3500 },
          
          // From investments to savings
          { source: 'investments', target: 'savings', value: 8000 }
        ]
      };

      setFlowData(mockData);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [dateRange, customDateRange, amountThreshold]);

  const handleDateRangeChange = (range, customRange) => {
    setDateRange(range);
    if (customRange) {
      setCustomDateRange(customRange);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSourceToggle = (sourceId) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  const handleExportReport = () => {
    // In a real implementation, this would generate and download a report
    console.log('Exporting report with current flow visualization');
  };

  const handleThresholdChange = (value) => {
    setAmountThreshold(value);
  };

  // Filtered data based on selected categories and sources
  const getFilteredData = () => {
    if (!flowData) return null;

    // If no filters are applied, return the original data
    if (selectedCategories.length === 0 && selectedSources.length === 0 && amountThreshold === 0) {
      return flowData;
    }

    // Filter nodes
    const filteredNodes = flowData.nodes.filter(node => {
      // Include if it's a selected category or source
      const isSelected = 
        (node.type === 'expense' && (selectedCategories.length === 0 || selectedCategories.includes(node.id))) ||
        (node.type === 'income' && (selectedSources.length === 0 || selectedSources.includes(node.id))) ||
        node.type === 'savings';
      
      // Include if value is above threshold
      const isAboveThreshold = node.value >= amountThreshold;
      
      return isSelected && isAboveThreshold;
    });

    // Get ids of filtered nodes
    const filteredNodeIds = filteredNodes.map(node => node.id);

    // Filter links that connect filtered nodes
    const filteredLinks = flowData.links.filter(link => {
      const sourceExists = filteredNodeIds.includes(link.source) || filteredNodeIds.includes(link.source.id);
      const targetExists = filteredNodeIds.includes(link.target) || filteredNodeIds.includes(link.target.id);
      const isAboveThreshold = link.value >= amountThreshold;
      
      return sourceExists && targetExists && isAboveThreshold;
    });

    return {
      nodes: filteredNodes,
      links: filteredLinks
    };
  };

  return (
    <div className={`min-h-screen bg-background transition-all ${isFullScreen ? 'p-0' : 'px-4 lg:px-6 py-6'}`}>
      {/* Dashboard Header - Hidden in fullscreen mode */}
      {!isFullScreen && (
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                  <Icon name="GitBranch" size={20} color="white" strokeWidth={2} />
                </div>
                <h1 className="text-2xl font-semibold text-text-primary">Transaction Flow Analysis</h1>
              </div>
              <p className="text-text-secondary">
                Visualize how money flows from income sources to expense categories
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportReport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-text-primary rounded-lg transition-smooth"
              >
                <Icon name="FileText" size={18} />
                <span className="hidden sm:inline">Export Report</span>
              </button>
              
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`flex items-center space-x-2 px-4 py-2 ${showComparison ? 'bg-primary-100 text-primary' : 'bg-gray-100 hover:bg-gray-200 text-text-primary'} rounded-lg transition-smooth`}
              >
                <Icon name="Split" size={18} />
                <span className="hidden sm:inline">Compare Periods</span>
              </button>
              
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-smooth"
              >
                <Icon name={isFullScreen ? 'Minimize2' : 'Maximize2'} size={18} />
                <span className="hidden sm:inline">{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Side Panel - Hidden in fullscreen mode */}
        {!isFullScreen && (
          <div className="xl:col-span-1 space-y-6">
            <DateRangeFilter 
              selectedRange={dateRange}
              customRange={customDateRange}
              onRangeChange={handleDateRangeChange}
            />
            
            <IncomeSourcesPanel 
              incomeSources={flowData?.nodes.filter(node => node.type === 'income') || []}
              selectedSources={selectedSources}
              onSourceToggle={handleSourceToggle}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={`${isFullScreen ? 'col-span-full' : 'xl:col-span-3'}`}>
          {/* Controls Bar - Always visible */}
          <FlowControls 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            amountThreshold={amountThreshold}
            onThresholdChange={handleThresholdChange}
            onFullscreenToggle={() => setIsFullScreen(!isFullScreen)}
            isFullScreen={isFullScreen}
          />

          {/* Flow Diagram */}
          <div className="bg-surface rounded-lg border border-border overflow-hidden mb-6">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text-primary">Money Flow Visualization</h2>
              <div className="flex space-x-2">
                {isFullScreen && (
                  <button
                    onClick={() => setIsFullScreen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
                    title="Exit fullscreen"
                  >
                    <Icon name="Minimize2" size={18} />
                  </button>
                )}
              </div>
            </div>
            
            <div className={`${isFullScreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'}`}>
              <FlowDiagram 
                data={getFilteredData()} 
                isLoading={isLoading}
                isFullScreen={isFullScreen}
                viewMode={viewMode}
              />
            </div>
          </div>

          {/* Period Comparison - Conditionally rendered */}
          {showComparison && !isFullScreen && (
            <ComparisonView 
              dateRange={dateRange} 
              onClose={() => setShowComparison(false)} 
            />
          )}

          {/* Expense Categories Panel - Only visible in non-fullscreen */}
          {!isFullScreen && (
            <ExpenseCategoriesPanel 
              expenseCategories={flowData?.nodes.filter(node => node.type === 'expense') || []}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionFlowAnalysisDashboard;