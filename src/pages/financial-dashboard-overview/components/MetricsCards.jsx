import React from 'react';
import Icon from 'components/AppIcon';

const MetricsCards = ({ totalIncome, totalExpenses, netCashFlow, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getNetCashFlowColor = () => {
    if (netCashFlow > 0) return 'text-success';
    if (netCashFlow < 0) return 'text-error';
    return 'text-text-secondary';
  };

  const getNetCashFlowBgColor = () => {
    if (netCashFlow > 0) return 'bg-gradient-to-r from-success/10 to-primary/10';
    if (netCashFlow < 0) return 'bg-gradient-to-r from-error/10 to-warning/10';
    return 'bg-gray-50';
  };

  const cards = [
    {
      id: 'income',
      title: 'Total Income',
      value: totalIncome,
      icon: 'TrendingUp',
      iconColor: 'text-success',
      bgColor: 'bg-success/10',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      id: 'expenses',
      title: 'Total Expenses',
      value: totalExpenses,
      icon: 'TrendingDown',
      iconColor: 'text-error',
      bgColor: 'bg-error/10',
      change: '+8.2%',
      changeType: 'negative'
    },
    {
      id: 'net-flow',
      title: 'Net Cash Flow',
      value: netCashFlow,
      icon: netCashFlow >= 0 ? 'ArrowUp' : 'ArrowDown',
      iconColor: getNetCashFlowColor(),
      bgColor: getNetCashFlowBgColor(),
      change: netCashFlow >= 0 ? '+15.3%' : '-5.2%',
      changeType: netCashFlow >= 0 ? 'positive' : 'negative'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-surface rounded-lg border border-border p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-32 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-surface rounded-lg border border-border p-6 hover:elevation-2 transition-smooth">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.bgColor}`}>
              <Icon name={card.icon} size={24} className={card.iconColor} strokeWidth={2} />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
              card.changeType === 'positive' ?'bg-success/10 text-success' :'bg-error/10 text-error'
            }`}>
              <Icon 
                name={card.changeType === 'positive' ? 'ArrowUp' : 'ArrowDown'} 
                size={12} 
              />
              <span>{card.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-text-secondary">{card.title}</p>
            <p className={`text-2xl font-bold ${card.id === 'net-flow' ? getNetCashFlowColor() : 'text-text-primary'}`}>
              {formatCurrency(card.value)}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border-light">
            <p className="text-xs text-text-secondary">
              {card.id === 'income' && 'From all revenue streams'}
              {card.id === 'expenses' && 'Across all categories'}
              {card.id === 'net-flow' && 'Available for savings & investment'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;