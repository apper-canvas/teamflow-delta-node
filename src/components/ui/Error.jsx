import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry = null,
  type = "general"
}) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'network':
        return 'WifiOff';
      case 'notfound':
        return 'SearchX';
      case 'permission':
        return 'ShieldAlert';
      default:
        return 'AlertTriangle';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-xl opacity-60"></div>
        <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-full border border-red-100">
          <ApperIcon 
            name={getErrorIcon()} 
            size={48} 
            className="text-red-500"
          />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;