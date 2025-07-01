import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on leave': return 'warning';
      default: return 'default';
    }
  };

  const handleViewProfile = () => {
    navigate(`/employees/${employee.Id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center border-4 border-white shadow-lg">
              <ApperIcon name="User" size={28} className="text-primary-600" />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 font-display truncate">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-gray-600 truncate">{employee.role}</p>
              <p className="text-sm text-gray-500 truncate">{employee.department}</p>
            </div>
            
            <Badge variant={getStatusVariant(employee.status)} size="sm">
              {employee.status}
            </Badge>
          </div>
          
          <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Mail" size={14} className="mr-1" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Phone" size={14} className="mr-1" />
              <span>{employee.phone}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              <span>Started {new Date(employee.startDate).toLocaleDateString()}</span>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                icon="Eye"
                onClick={handleViewProfile}
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="Edit"
                onClick={() => onEdit(employee)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;