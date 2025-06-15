import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/financial-dashboard-overview': {
      title: 'Dashboard',
      description: 'Financial overview and key metrics'
    },
    '/transaction-history-analysis': {
      title: 'Transaction Analysis',
      description: 'Detailed transaction history and patterns'
    },
    '/category-management': {
      title: 'Category Management',
      description: 'Manage transaction categories and settings'
    }
  };

  const currentPath = pathMap[location.pathname];
  
  if (!currentPath) {
    return null;
  }

  const handleBack = () => {
    if (location.pathname !== '/financial-dashboard-overview') {
      navigate('/financial-dashboard-overview');
    }
  };

  const isHomePage = location.pathname === '/financial-dashboard-overview';

  return (
    <div className="bg-surface border-b border-border-light">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button - Hidden on mobile, shown on desktop for non-home pages */}
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-50 transition-smooth"
                title="Back to Dashboard"
              >
                <Icon name="ArrowLeft" size={16} className="text-text-secondary" />
              </button>
            )}

            {/* Mobile Back Button - Always visible on mobile for non-home pages */}
            {!isHomePage && (
              <button
                onClick={handleBack}
                className="sm:hidden flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-smooth"
              >
                <Icon name="ArrowLeft" size={16} />
                <span className="text-sm font-medium">Back</span>
              </button>
            )}

            {/* Breadcrumb Trail - Desktop */}
            <div className="hidden sm:flex items-center space-x-2">
              {!isHomePage && (
                <>
                  <button
                    onClick={() => navigate('/financial-dashboard-overview')}
                    className="text-sm text-text-secondary hover:text-primary transition-smooth"
                  >
                    Dashboard
                  </button>
                  <Icon name="ChevronRight" size={14} className="text-text-secondary" />
                </>
              )}
              <span className="text-sm font-medium text-text-primary">
                {currentPath.title}
              </span>
            </div>

            {/* Mobile - Current Page Only */}
            <div className="sm:hidden">
              <h1 className="text-lg font-semibold text-text-primary">
                {currentPath.title}
              </h1>
            </div>
          </div>

          {/* Page Description - Desktop Only */}
          <div className="hidden lg:block">
            <p className="text-sm text-text-secondary">
              {currentPath.description}
            </p>
          </div>
        </div>

        {/* Mobile Description */}
        <div className="sm:hidden mt-1">
          <p className="text-sm text-text-secondary">
            {currentPath.description}
          </p>
        </div>

        {/* Desktop Page Title */}
        <div className="hidden sm:block mt-2">
          <h1 className="text-2xl font-semibold text-text-primary">
            {currentPath.title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;