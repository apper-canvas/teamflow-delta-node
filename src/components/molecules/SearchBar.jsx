import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const SearchBar = ({ 
  searchValue = '', 
  onSearchChange = () => {}, 
  filters = [],
  activeFilters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  placeholder = "Search...",
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = Object.values(activeFilters).some(value => value && value !== '');

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            icon="Search"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon="Filter"
            onClick={() => setShowFilters(!showFilters)}
            className={`${hasActiveFilters ? 'border-primary-500 bg-primary-50 text-primary-700' : ''}`}
          >
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                {Object.values(activeFilters).filter(value => value && value !== '').length}
              </span>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              icon="X"
              onClick={onClearFilters}
              size="md"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {showFilters && filters.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                label={filter.label}
                value={activeFilters[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                options={filter.options}
                placeholder={`All ${filter.label}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;