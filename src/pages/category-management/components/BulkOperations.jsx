import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BulkOperations = ({
  selectedCount,
  onMerge,
  onDelete,
  onClearSelection
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleMerge = () => {
    setShowDropdown(false);
    setShowMergeModal(true);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    setShowDeleteModal(true);
  };

  const confirmMerge = () => {
    onMerge();
    setShowMergeModal(false);
    onClearSelection();
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
    onClearSelection();
  };

  return (
    <>
      <div className="flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
        <Icon name="CheckSquare" size={16} className="text-primary" />
        <span className="text-sm font-medium text-primary">
          {selectedCount} selected
        </span>
        
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-1 px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-600 transition-smooth"
          >
            <span>Actions</span>
            <Icon name="ChevronDown" size={14} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg elevation-3 border border-border z-10">
              <div className="py-2">
                <button
                  onClick={handleMerge}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-smooth"
                >
                  <Icon name="Merge" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-primary">Merge Categories</span>
                </button>
                
                <button
                  onClick={() => {
                    console.log('Export selected categories');
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-smooth"
                >
                  <Icon name="Download" size={16} className="text-text-secondary" />
                  <span className="text-sm text-text-primary">Export Selected</span>
                </button>
                
                <div className="border-t border-border my-1" />
                
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 transition-smooth"
                >
                  <Icon name="Trash2" size={16} className="text-error" />
                  <span className="text-sm text-error">Delete Selected</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClearSelection}
          className="p-1 hover:bg-primary-100 rounded transition-smooth"
          title="Clear selection"
        >
          <Icon name="X" size={14} className="text-primary" />
        </button>
      </div>

      {/* Merge Modal */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning bg-opacity-20 rounded-lg flex items-center justify-center">
                <Icon name="Merge" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Merge Categories</h3>
                <p className="text-sm text-text-secondary">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-text-secondary mb-4">
                You are about to merge {selectedCount} categories. All transactions from the selected categories will be moved to the target category.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Select target category:
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Choose a category...</option>
                  <option value="housing">Housing & Utilities</option>
                  <option value="transportation">Transportation</option>
                  <option value="food-dining">Food & Dining</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={confirmMerge}
                className="flex-1 bg-warning hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-smooth"
              >
                Merge Categories
              </button>
              <button
                onClick={() => setShowMergeModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-primary py-2 px-4 rounded-lg transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error bg-opacity-20 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Delete Categories</h3>
                <p className="text-sm text-text-secondary">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-text-secondary">
                You are about to delete {selectedCount} categories. All transactions in these categories will be moved to "Uncategorized".
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-error hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-smooth"
              >
                Delete Categories
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-text-primary py-2 px-4 rounded-lg transition-smooth"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkOperations;