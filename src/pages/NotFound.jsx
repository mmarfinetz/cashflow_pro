import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/financial-dashboard-overview');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center">
            <Icon name="AlertTriangle" size={48} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-smooth flex items-center justify-center space-x-2"
          >
            <Icon name="Home" size={20} />
            <span>Back to Dashboard</span>
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-text-primary font-medium py-3 px-6 rounded-lg transition-smooth flex items-center justify-center space-x-2"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;