import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const LeaveRequestCard = ({ request, employee, onApprove, onReject }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'vacation': return 'Palmtree';
      case 'sick': return 'Heart';
      case 'personal': return 'User';
      case 'maternity': return 'Baby';
      case 'paternity': return 'Users';
      default: return 'Calendar';
    }
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {employee?.firstName?.charAt(0)}{employee?.lastName?.charAt(0)}
            </span>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              {employee?.firstName} {employee?.lastName}
            </h3>
            <p className="text-sm text-gray-600">{employee?.role}</p>
          </div>
        </div>
        
        <Badge variant={getStatusVariant(request.status)} size="sm">
          {request.status}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <ApperIcon name={getLeaveTypeIcon(request.type)} size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-900">{request.type} Leave</span>
          <span className="text-sm text-gray-500">
            ({calculateDays(request.startDate, request.endDate)} days)
          </span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={14} />
            <span>{format(new Date(request.startDate), 'MMM dd')}</span>
          </div>
          <span>→</span>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Calendar" size={14} />
            <span>{format(new Date(request.endDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>
        
        {request.reason && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{request.reason}</p>
          </div>
        )}
      </div>
      
      {request.status === 'Pending' && (
        <div className="flex space-x-3">
          <Button
            variant="success"
            size="sm"
            icon="Check"
            onClick={() => onApprove(request.Id)}
            className="flex-1"
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon="X"
            onClick={() => onReject(request.Id)}
            className="flex-1"
          >
            Reject
          </Button>
        </div>
      )}
      
      {request.status !== 'Pending' && request.approvedBy && (
        <div className="text-xs text-gray-500 flex items-center mt-3">
          <ApperIcon name="User" size={12} className="mr-1" />
          {request.status} by {request.approvedBy}
        </div>
      )}
    </motion.div>
  );
};

export default LeaveRequestCard;