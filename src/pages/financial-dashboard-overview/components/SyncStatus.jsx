import React, { useEffect, useState } from 'react';
import Icon from 'components/AppIcon';

const SyncStatus = ({ status, onRefresh }) => {
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const diffInMinutes = Math.floor((now - lastSyncTime) / (1000 * 60));
      
      if (diffInMinutes < 1) {
        setTimeAgo('Just now');
      } else if (diffInMinutes < 60) {
        setTimeAgo(`${diffInMinutes}m ago`);
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        setTimeAgo(`${diffInHours}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastSyncTime]);

  useEffect(() => {
    if (status === 'synced') {
      setLastSyncTime(new Date());
    }
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case 'syncing':
        return {
          icon: 'RefreshCw',
          iconClass: 'text-warning animate-spin',
          bgClass: 'bg-warning/10',
          textClass: 'text-warning',
          label: 'Syncing...',
          description: 'Updating financial data'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          iconClass: 'text-error',
          bgClass: 'bg-error/10',
          textClass: 'text-error',
          label: 'Sync Failed',
          description: 'Unable to update data'
        };
      case 'synced':
      default:
        return {
          icon: 'CheckCircle',
          iconClass: 'text-success',
          bgClass: 'bg-success/10',
          textClass: 'text-success',
          label: 'Up to Date',
          description: `Last sync: ${timeAgo}`
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleRefresh = () => {
    if (onRefresh && status !== 'syncing') {
      onRefresh();
      // Simulate sync completion after 2 seconds
      setTimeout(() => {
        setLastSyncTime(new Date());
      }, 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Sync Status</h3>
        <button
          onClick={handleRefresh}
          disabled={status === 'syncing'}
          className="flex items-center justify-center w-8 h-8 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 rounded-lg transition-smooth"
          title="Refresh data"
        >
          <Icon 
            name="RefreshCw" 
            size={16} 
            className={status === 'syncing' ? 'animate-spin' : ''} 
          />
        </button>
      </div>

      <div className={`p-4 rounded-lg ${statusConfig.bgClass}`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="flex-shrink-0">
            <Icon 
              name={statusConfig.icon} 
              size={20} 
              className={statusConfig.iconClass} 
            />
          </div>
          <div className="flex-1">
            <div className={`font-medium ${statusConfig.textClass}`}>
              {statusConfig.label}
            </div>
            <div className="text-sm text-text-secondary">
              {statusConfig.description}
            </div>
          </div>
        </div>

        {status === 'error' && (
          <div className="mt-3">
            <button
              onClick={handleRefresh}
              className="text-sm text-error hover:text-error/80 font-medium transition-smooth"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Connection Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Bank Connection</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-success font-medium">Connected</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Data Source</span>
          <span className="text-text-primary font-medium">Plaid API</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Auto Sync</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-primary font-medium">Every 15 min</span>
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="pt-4 border-t border-border-light">
        <h4 className="text-sm font-medium text-text-primary mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {[
            { time: '2 min ago', action: 'Transaction sync completed', status: 'success' },
            { time: '15 min ago', action: 'Balance updated', status: 'success' },
            { time: '1 hour ago', action: 'Category mapping updated', status: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className={`w-1.5 h-1.5 rounded-full ${
                activity.status === 'success' ? 'bg-success' : 'bg-error'
              }`}></div>
              <span className="text-text-secondary">{activity.time}</span>
              <span className="text-text-primary">{activity.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyncStatus;