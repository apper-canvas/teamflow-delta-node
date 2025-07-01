import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';

const DepartmentCard = ({ department, employees = [], onClick }) => {
  const departmentEmployees = employees.filter(emp => emp.department === department.name);
  const manager = employees.find(emp => emp.Id === department.managerId);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100">
            <ApperIcon name="Building2" size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              {department.name}
            </h3>
            {manager && (
              <p className="text-sm text-gray-600">
                Manager: {manager.firstName} {manager.lastName}
              </p>
            )}
          </div>
        </div>
        
        <Badge variant="primary" size="sm">
          {departmentEmployees.length} employees
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Active Employees</span>
          <span className="font-medium text-gray-900">
            {departmentEmployees.filter(emp => emp.status === 'Active').length}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">On Leave</span>
          <span className="font-medium text-gray-900">
            {departmentEmployees.filter(emp => emp.status === 'On Leave').length}
          </span>
        </div>
        
        {departmentEmployees.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex -space-x-2">
              {departmentEmployees.slice(0, 4).map((employee) => (
                <div
                  key={employee.Id}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white flex items-center justify-center"
                  title={`${employee.firstName} ${employee.lastName}`}
                >
                  <span className="text-xs font-medium text-gray-700">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </span>
                </div>
              ))}
              {departmentEmployees.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{departmentEmployees.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DepartmentCard;