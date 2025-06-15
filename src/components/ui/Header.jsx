import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/financial-dashboard-overview',
      icon: 'BarChart3',
      description: 'Overview of financial metrics'
    },
    {
      name: 'Transactions',
      path: '/transaction-history-analysis',
      icon: 'List',
      description: 'Detailed transaction analysis'
    },
    {
      name: 'Settings',
      path: '/category-management',
      icon: 'Settings',
      description: 'Category management'
    }
  ];

  const accounts = [
    {
      id: 1,
      name: 'Main Business Account',
      type: 'Checking',
      balance: '$45,230.50',
      isActive: true
    },
    {
      id: 2,
      name: 'Savings Account',
      type: 'Savings',
      balance: '$12,450.00',
      isActive: false
    }
  ];

  const activeAccount = accounts.find(account => account.isActive);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(prev => prev === 'syncing' ? 'synced' : prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleAccountSwitch = (accountId) => {
    console.log('Switching to account:', accountId);
    setIsAccountDropdownOpen(false);
  };

  const handleSyncRefresh = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('synced'), 2000);
  };

  const isActivePath = (path) => location.pathname === path;

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'RefreshCw';
      case 'error':
        return 'AlertCircle';
      default:
        return 'CheckCircle';
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-success';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-border elevation-1">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-semibold text-text-primary">FinanceFlow</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth min-h-44
                  ${isActivePath(item.path)
                    ? 'bg-primary-50 text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                  }
                `}
                title={item.description}
              >
                <Icon name={item.icon} size={18} strokeWidth={2} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Sync Status */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={handleSyncRefresh}
                className={`
                  flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-smooth
                  ${getSyncStatusColor()} hover:bg-gray-50
                  ${syncStatus === 'syncing' ? 'animate-pulse' : ''}
                `}
                title={`Data sync status: ${syncStatus}`}
              >
                <Icon 
                  name={getSyncStatusIcon()} 
                  size={14} 
                  className={syncStatus === 'syncing' ? 'animate-spin' : ''} 
                />
                <span className="capitalize">{syncStatus}</span>
              </button>
            </div>

            {/* Account Selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-smooth min-h-44 min-w-44"
              >
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-text-primary truncate max-w-32">
                    {activeAccount?.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {activeAccount?.balance}
                  </span>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg elevation-3 border border-border z-1010">
                  <div className="p-2">
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleAccountSwitch(account.id)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg text-left transition-smooth
                          ${account.isActive 
                            ? 'bg-primary-50 border border-primary-200' :'hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-text-primary">
                            {account.name}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {account.type}
                          </span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-medium text-text-primary">
                            {account.balance}
                          </span>
                          {account.isActive && (
                            <Icon name="Check" size={14} className="text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-50 transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-surface">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-smooth
                    ${isActivePath(item.path)
                      ? 'bg-primary-50 text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon name={item.icon} size={20} strokeWidth={2} />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-text-secondary">{item.description}</span>
                  </div>
                </button>
              ))}
              
              {/* Mobile Sync Status */}
              <div className="px-4 pt-2 border-t border-border">
                <button
                  onClick={handleSyncRefresh}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-smooth
                    ${getSyncStatusColor()} hover:bg-gray-50
                  `}
                >
                  <Icon 
                    name={getSyncStatusIcon()} 
                    size={16} 
                    className={syncStatus === 'syncing' ? 'animate-spin' : ''} 
                  />
                  <span>Sync Status: {syncStatus}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;