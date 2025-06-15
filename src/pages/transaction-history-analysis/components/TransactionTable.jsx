import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const TransactionTable = ({
  transactions,
  loading,
  selectedTransactions,
  sortConfig,
  categories,
  onSort,
  onTransactionSelect,
  onSelectAll,
  onTransactionDetail,
  onCategoryUpdate,
  currentPage,
  totalPages,
  rowsPerPage,
  totalTransactions,
  onPageChange,
  onRowsPerPageChange
}) => {
  const [editingCategory, setEditingCategory] = useState(null);

  const formatAmount = (amount) => {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return amount < 0 ? `-${formatted}` : formatted;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleCategoryChange = (transactionId, newCategory) => {
    onCategoryUpdate(transactionId, newCategory);
    setEditingCategory(null);
  };

  const allSelected = transactions.length > 0 && transactions.every(t => selectedTransactions.includes(t.id));
  const someSelected = selectedTransactions.length > 0 && !allSelected;

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </th>
              
              {[
                { key: 'date', label: 'Date' },
                { key: 'description', label: 'Description' },
                { key: 'amount', label: 'Amount' },
                { key: 'category', label: 'Category' },
                { key: 'account', label: 'Account' }
              ].map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-smooth"
                  onClick={() => onSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <Icon name={getSortIcon(column.key)} size={12} />
                  </div>
                </th>
              ))}
              
              <th className="w-20 px-4 py-3"></th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`
                  hover:bg-gray-50 transition-smooth
                  ${selectedTransactions.includes(transaction.id) ? 'bg-primary-50' : ''}
                `}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id)}
                    onChange={(e) => onTransactionSelect(transaction.id, e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                </td>
                
                <td className="px-4 py-4 text-sm text-text-primary">
                  {formatDate(transaction.date)}
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary">
                      {transaction.description}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {transaction.merchant}
                    </span>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <span
                    className={`text-sm font-medium ${
                      transaction.amount >= 0 ? 'text-success' : 'text-text-primary'
                    }`}
                  >
                    {formatAmount(transaction.amount)}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  {editingCategory === transaction.id ? (
                    <select
                      value={transaction.category}
                      onChange={(e) => handleCategoryChange(transaction.id, e.target.value)}
                      onBlur={() => setEditingCategory(null)}
                      autoFocus
                      className="text-sm border border-border rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingCategory(transaction.id)}
                      className="flex items-center space-x-2 px-2 py-1 rounded text-sm hover:bg-gray-100 transition-smooth"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: categories.find(c => c.name === transaction.category)?.color || '#6B7280'
                        }}
                      ></div>
                      <span>{transaction.category}</span>
                      <Icon name="ChevronDown" size={12} />
                    </button>
                  )}
                </td>
                
                <td className="px-4 py-4 text-sm text-text-secondary">
                  {transaction.account}
                </td>
                
                <td className="px-4 py-4">
                  <button
                    onClick={() => onTransactionDetail(transaction)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
                    title="View details"
                  >
                    <Icon name="Eye" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-border">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={`
              p-4 transition-smooth
              ${selectedTransactions.includes(transaction.id) ? 'bg-primary-50' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedTransactions.includes(transaction.id)}
                  onChange={(e) => onTransactionSelect(transaction.id, e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDate(transaction.date)} • {transaction.merchant}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => onTransactionDetail(transaction)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-smooth"
              >
                <Icon name="Eye" size={16} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: categories.find(c => c.name === transaction.category)?.color || '#6B7280'
                  }}
                ></div>
                <span className="text-sm text-text-secondary">{transaction.category}</span>
              </div>
              
              <span
                className={`text-sm font-medium ${
                  transaction.amount >= 0 ? 'text-success' : 'text-text-primary'
                }`}
              >
                {formatAmount(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, totalTransactions)} of {totalTransactions} transactions
            </span>
            
            <select
              value={rowsPerPage}
              onChange={(e) => onRowsPerPageChange(parseInt(e.target.value))}
              className="text-sm border border-border rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`
                      w-8 h-8 text-sm rounded-lg transition-smooth
                      ${pageNum === currentPage
                        ? 'bg-primary text-white' :'hover:bg-gray-100 text-text-secondary'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <span>Next</span>
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;