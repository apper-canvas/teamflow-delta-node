import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = (hoverRating || rating) >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className={`
              transition-all duration-200 transform
              ${!readOnly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}
              ${readOnly ? '' : 'hover:text-yellow-400'}
            `}
          >
            <ApperIcon
              name="Star"
              size={size}
              className={`
                transition-colors duration-200
                ${isActive 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 hover:text-yellow-200'
                }
              `}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;