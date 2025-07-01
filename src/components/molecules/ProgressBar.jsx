import React from 'react';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label, 
  color = 'blue', 
  showValue = true, 
  animated = true 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    indigo: 'bg-indigo-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && (
            <span className="text-sm text-gray-600">
              {typeof value === 'number' ? `${Math.round(percentage)}%` : value}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`
            h-2.5 rounded-full transition-all duration-500 ease-out
            ${colorClasses[color] || colorClasses.blue}
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ 
            width: `${percentage}%`,
            transition: animated ? 'width 0.8s ease-out' : 'width 0.3s ease-out'
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;