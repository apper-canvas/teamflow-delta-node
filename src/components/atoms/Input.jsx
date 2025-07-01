import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label = '', 
  type = 'text', 
  placeholder = '', 
  value = '', 
  onChange = () => {}, 
  error = '', 
  icon = null,
  className = '',
  required = false,
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full rounded-lg border-2 px-4 py-3 text-sm placeholder-gray-400 transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;