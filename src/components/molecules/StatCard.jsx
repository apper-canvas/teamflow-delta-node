import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change = null, 
  changeType = 'neutral',
  gradient = 'primary',
  className = ''
}) => {
  const gradients = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-amber-500 to-amber-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600'
  };

  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 font-display">
            {value}
          </p>
          {change && (
            <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={12} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-xl bg-gradient-to-r ${gradients[gradient]} shadow-lg`}>
          <ApperIcon name={icon} size={28} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;