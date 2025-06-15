import React from 'react';
import Icon from 'components/AppIcon';

const FinancialDashboardOverview = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 lg:px-6 py-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={32} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Financial Dashboard</h1>
          <p className="text-text-secondary">
            This page will contain the main financial dashboard with Sankey diagrams and analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboardOverview;