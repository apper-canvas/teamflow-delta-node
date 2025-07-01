import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LeaveRequestModal = ({ employees, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Emergency Leave'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeId) newErrors.employeeId = 'Employee is required';
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const submitData = {
      ...formData,
      employeeId: parseInt(formData.employeeId),
      requestDate: new Date().toISOString().split('T')[0],
      days: calculateDays(formData.startDate, formData.endDate)
    };
    
    await onSubmit(submitData);
    setIsSubmitting(false);
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">New Leave Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ApperIcon name="X" size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors
                ${errors.employeeId ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.Id} value={employee.Id}>
                  {employee.name} - {employee.department}
                </option>
              ))}
            </select>
            {errors.employeeId && (
              <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>
            )}
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave Type *
            </label>
            <select
              value={formData.leaveType}
              onChange={(e) => handleInputChange('leaveType', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors
                ${errors.leaveType ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="">Select Leave Type</option>
              {leaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.leaveType && (
              <p className="text-red-500 text-sm mt-1">{errors.leaveType}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors
                  ${errors.startDate ? 'border-red-500' : 'border-gray-300'}
                `}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors
                  ${errors.endDate ? 'border-red-500' : 'border-gray-300'}
                `}
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {formData.startDate && formData.endDate && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Calendar" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  Duration: {calculateDays(formData.startDate, formData.endDate)} day(s)
                </span>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={4}
              placeholder="Please provide a reason for your leave request..."
              className={`
                w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none
                ${errors.reason ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              icon={isSubmitting ? "Loader" : "Check"}
            >
              {isSubmitting ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LeaveRequestModal;