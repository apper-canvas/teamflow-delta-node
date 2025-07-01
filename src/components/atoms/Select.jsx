import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Select = ({ 
  label = '', 
  value = '', 
  onChange = () => {}, 
  options = [], 
  placeholder = 'Select an option',
  error = '', 
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
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full rounded-lg border-2 px-4 py-3 text-sm transition-all duration-200 appearance-none bg-white
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500'
            }
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
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

export default Select;