import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet.", 
  action = null,
  icon = "Inbox",
  type = "default" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'employees':
        return {
          icon: 'Users',
          title: 'No employees found',
          description: 'Start building your team by adding your first employee.'
        };
      case 'departments':
        return {
          icon: 'Building2',
          title: 'No departments set up',
          description: 'Create departments to organize your team structure.'
        };
      case 'leave':
        return {
          icon: 'Calendar',
          title: 'No leave requests',
          description: 'All leave requests will appear here when submitted.'
        };
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          description: 'Try adjusting your search terms or filters.'
        };
      default:
        return { icon, title, description };
    }
  };

  const content = getEmptyContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-50"></div>
        <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl border border-primary-100">
          <ApperIcon 
            name={content.icon} 
            size={64} 
            className="text-primary-500"
          />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed text-lg">
        {content.description}
      </p>
      
      {action && (
        <div className="space-y-3">
          {action}
        </div>
      )}
    </div>
  );
};

export default Empty;