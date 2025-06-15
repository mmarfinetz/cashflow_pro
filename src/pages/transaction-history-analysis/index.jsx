import React, { useState, useEffect, useMemo } from 'react';
import Icon from 'components/AppIcon';
import FilterBar from './components/FilterBar';
import TransactionTable from './components/TransactionTable';
import CategorySidebar from './components/CategorySidebar';
import ExportModal from './components/ExportModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import BulkActionBar from './components/BulkActionBar';

const TransactionHistoryAnalysis = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: { start: null, end: null },
    categories: [],
    amountRange: { min: 0, max: 10000 },
    accounts: [],
    searchTerm: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'txn_001',
      date: new Date('2024-01-15'),
      description: 'Office Supplies - Staples',
      amount: -245.67,
      category: 'Office Expenses',
      subcategory: 'Supplies',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'Staples Inc.',
      status: 'completed',
      reference: 'REF001234'
    },
    {
      id: 'txn_002',
      date: new Date('2024-01-14'),
      description: 'Client Payment - ABC Corp',
      amount: 5000.00,
      category: 'Revenue',
      subcategory: 'Consulting',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'ABC Corporation',
      status: 'completed',
      reference: 'INV2024001'
    },
    {
      id: 'txn_003',
      date: new Date('2024-01-13'),
      description: 'Internet Service - Comcast',
      amount: -89.99,
      category: 'Utilities',
      subcategory: 'Internet',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'Comcast Business',
      status: 'completed',
      reference: 'BILL789'
    },
    {
      id: 'txn_004',
      date: new Date('2024-01-12'),
      description: 'Software License - Adobe',
      amount: -52.99,
      category: 'Software',
      subcategory: 'Design Tools',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'Adobe Systems',
      status: 'completed',
      reference: 'SUB456'
    },
    {
      id: 'txn_005',
      date: new Date('2024-01-11'),
      description: 'Fuel - Shell Station',
      amount: -45.23,
      category: 'Transportation',
      subcategory: 'Fuel',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'Shell',
      status: 'completed',
      reference: 'FUEL123'
    },
    {
      id: 'txn_006',
      date: new Date('2024-01-10'),
      description: 'Marketing Campaign - Google Ads',
      amount: -350.00,
      category: 'Marketing',
      subcategory: 'Digital Advertising',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'Google LLC',
      status: 'completed',
      reference: 'ADS789'
    },
    {
      id: 'txn_007',
      date: new Date('2024-01-09'),
      description: 'Equipment Purchase - Best Buy',
      amount: -1299.99,
      category: 'Equipment',
      subcategory: 'Computer Hardware',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'Best Buy Business',
      status: 'completed',
      reference: 'EQ001'
    },
    {
      id: 'txn_008',
      date: new Date('2024-01-08'),
      description: 'Consulting Revenue - XYZ Ltd',
      amount: 2500.00,
      category: 'Revenue',
      subcategory: 'Consulting',
      account: 'Main Business Account',
      accountId: 'acc_001',
      merchant: 'XYZ Limited',
      status: 'completed',
      reference: 'INV2024002'
    }
  ];

  const categories = [
    { id: 'revenue', name: 'Revenue', color: '#10B981', subcategories: ['Consulting', 'Products', 'Services'] },
    { id: 'office', name: 'Office Expenses', color: '#3B82F6', subcategories: ['Supplies', 'Rent', 'Utilities'] },
    { id: 'marketing', name: 'Marketing', color: '#8B5CF6', subcategories: ['Digital Advertising', 'Print', 'Events'] },
    { id: 'equipment', name: 'Equipment', color: '#F59E0B', subcategories: ['Computer Hardware', 'Furniture', 'Tools'] },
    { id: 'software', name: 'Software', color: '#EF4444', subcategories: ['Design Tools', 'Productivity', 'Development'] },
    { id: 'transportation', name: 'Transportation', color: '#06B6D4', subcategories: ['Fuel', 'Maintenance', 'Insurance'] },
    { id: 'utilities', name: 'Utilities', color: '#84CC16', subcategories: ['Internet', 'Phone', 'Electricity'] }
  ];

  const accounts = [
    { id: 'acc_001', name: 'Main Business Account', type: 'Checking' },
    { id: 'acc_002', name: 'Savings Account', type: 'Savings' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      // Date range filter
      if (filters.dateRange.start && transaction.date < filters.dateRange.start) return false;
      if (filters.dateRange.end && transaction.date > filters.dateRange.end) return false;
      
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(transaction.category)) return false;
      
      // Amount range filter
      const absAmount = Math.abs(transaction.amount);
      if (absAmount < filters.amountRange.min || absAmount > filters.amountRange.max) return false;
      
      // Account filter
      if (filters.accounts.length > 0 && !filters.accounts.includes(transaction.accountId)) return false;
      
      // Search term filter
      if (filters.searchTerm && !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
      
      return true;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleTransactionSelect = (transactionId, selected) => {
    if (selected) {
      setSelectedTransactions(prev => [...prev, transactionId]);
    } else {
      setSelectedTransactions(prev => prev.filter(id => id !== transactionId));
    }
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedTransactions(paginatedTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleBulkCategoryUpdate = (categoryId) => {
    // Mock bulk update
    console.log('Updating categories for transactions:', selectedTransactions, 'to category:', categoryId);
    setSelectedTransactions([]);
  };

  const handleTransactionDetail = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  const handleCategoryUpdate = (transactionId, newCategory) => {
    setTransactions(prev => prev.map(t => 
      t.id === transactionId ? { ...t, category: newCategory } : t
    ));
  };

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) return count + filter.length;
    if (typeof filter === 'object' && filter !== null) {
      if (filter.start || filter.end) return count + 1;
      if (filter.min > 0 || filter.max < 10000) return count + 1;
    }
    if (typeof filter === 'string' && filter.length > 0) return count + 1;
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 lg:px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary mb-2">
                Transaction History & Analysis
              </h1>
              <p className="text-text-secondary">
                Analyze and categorize your financial transactions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCategorySidebar(!showCategorySidebar)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-gray-50 transition-smooth"
              >
                <Icon name="Settings" size={16} />
                <span className="text-sm font-medium">Categories</span>
              </button>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-smooth"
              >
                <Icon name="Download" size={16} />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={handleFilterChange}
          categories={categories}
          accounts={accounts}
          activeFiltersCount={activeFiltersCount}
        />

        {/* Bulk Action Bar */}
        {selectedTransactions.length > 0 && (
          <BulkActionBar
            selectedCount={selectedTransactions.length}
            categories={categories}
            onBulkCategoryUpdate={handleBulkCategoryUpdate}
            onClearSelection={() => setSelectedTransactions([])}
          />
        )}

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Transaction Table */}
          <div className="flex-1">
            <TransactionTable
              transactions={paginatedTransactions}
              loading={loading}
              selectedTransactions={selectedTransactions}
              sortConfig={sortConfig}
              categories={categories}
              onSort={handleSort}
              onTransactionSelect={handleTransactionSelect}
              onSelectAll={handleSelectAll}
              onTransactionDetail={handleTransactionDetail}
              onCategoryUpdate={handleCategoryUpdate}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalTransactions={filteredAndSortedTransactions.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </div>

          {/* Category Sidebar - Desktop */}
          <div className="hidden lg:block">
            <CategorySidebar
              categories={categories}
              transactions={filteredAndSortedTransactions}
            />
          </div>
        </div>

        {/* Mobile Category Sidebar */}
        {showCategorySidebar && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowCategorySidebar(false)}>
            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-surface" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">Category Management</h3>
                  <button
                    onClick={() => setShowCategorySidebar(false)}
                    className="p-2 hover:bg-gray-50 rounded-lg transition-smooth"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <CategorySidebar
                  categories={categories}
                  transactions={filteredAndSortedTransactions}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showExportModal && (
          <ExportModal
            transactions={filteredAndSortedTransactions}
            filters={filters}
            onClose={() => setShowExportModal(false)}
          />
        )}

        {showDetailModal && selectedTransaction && (
          <TransactionDetailModal
            transaction={selectedTransaction}
            categories={categories}
            onClose={() => setShowDetailModal(false)}
            onCategoryUpdate={handleCategoryUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryAnalysis;