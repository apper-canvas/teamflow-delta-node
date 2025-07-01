import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { notificationService } from '@/services/api/notificationService';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && activities.length === 0) {
      loadActivities();
    }
  }, [isOpen]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getRecentActivities();
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityTime = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'employee_created':
        return 'UserPlus';
      case 'employee_updated':
        return 'UserCheck';
      case 'leave_requested':
        return 'Calendar';
      case 'leave_approved':
        return 'CheckCircle';
      case 'leave_rejected':
        return 'XCircle';
      default:
        return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'employee_created':
        return 'text-green-600 bg-green-100';
      case 'employee_updated':
        return 'text-blue-600 bg-blue-100';
      case 'leave_requested':
        return 'text-yellow-600 bg-yellow-100';
      case 'leave_approved':
        return 'text-green-600 bg-green-100';
      case 'leave_rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const unreadCount = activities.filter(activity => !activity.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <ApperIcon name="Bell" size={20} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest updates and notifications</p>
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {loading ? (
                <div className="p-4 text-center">
                  <ApperIcon name="Loader2" size={20} className="animate-spin text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">Loading activities...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="p-6 text-center">
                  <ApperIcon name="Bell" size={32} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No recent activities</p>
                  <p className="text-xs text-gray-500 mt-1">New notifications will appear here</p>
                </div>
              ) : (
                <div className="py-2">
                  {activities.map((activity) => (
                    <div
                      key={activity.Id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                        !activity.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          <ApperIcon name={getActivityIcon(activity.type)} size={14} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {activity.employeePhoto && (
                              <img
                                src={activity.employeePhoto}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {activity.employeeName}
                            </p>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {activity.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {formatActivityTime(activity.timestamp)}
                            </span>
                            {!activity.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {activities.length > 0 && (
              <div className="p-3 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All Activities
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;