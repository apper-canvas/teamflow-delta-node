import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LeaveRequestCard from '@/components/molecules/LeaveRequestCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { leaveService } from '@/services/api/leaveService';
import { employeeService } from '@/services/api/employeeService';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [showCreateModal, setShowCreateModal] = useState(false);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [leaveData, employeesData] = await Promise.all([
        leaveService.getAll(),
        employeeService.getAll()
      ]);
      
      setLeaveRequests(leaveData);
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load leave requests');
      console.error('Error loading leave requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (requestId) => {
    try {
      const updatedRequest = await leaveService.update(requestId, { 
        status: 'Approved',
        approvedBy: 'HR Admin'
      });
      
      setLeaveRequests(prev => 
        prev.map(req => req.Id === requestId ? updatedRequest : req)
      );
      
      toast.success('Leave request approved');
    } catch (error) {
      toast.error('Failed to approve leave request');
    }
  };

  const handleRejectLeave = async (requestId) => {
    try {
      const updatedRequest = await leaveService.update(requestId, { 
        status: 'Rejected',
        approvedBy: 'HR Admin'
      });
      
      setLeaveRequests(prev => 
        prev.map(req => req.Id === requestId ? updatedRequest : req)
      );
      
      toast.success('Leave request rejected');
    } catch (error) {
      toast.error('Failed to reject leave request');
    }
};

  const handleCreateLeave = async (leaveData) => {
    try {
      const newRequest = await leaveService.create(leaveData);
      setLeaveRequests(prev => [...prev, newRequest]);
      setShowCreateModal(false);
      toast.success('Leave request created successfully');
    } catch (error) {
      toast.error('Failed to create leave request');
    }
  };
  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const pendingRequests = leaveRequests.filter(req => req.status === 'Pending');
  const approvedRequests = leaveRequests.filter(req => req.status === 'Approved');
  const rejectedRequests = leaveRequests.filter(req => req.status === 'Rejected');
  const allRequests = leaveRequests;

  const getFilteredRequests = () => {
    switch (activeTab) {
      case 'pending': return pendingRequests;
      case 'approved': return approvedRequests;
      case 'rejected': return rejectedRequests;
      case 'all': return allRequests;
      default: return pendingRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

  const tabs = [
    { key: 'pending', label: 'Pending', count: pendingRequests.length, color: 'warning' },
    { key: 'approved', label: 'Approved', count: approvedRequests.length, color: 'success' },
    { key: 'rejected', label: 'Rejected', count: rejectedRequests.length, color: 'error' },
    { key: 'all', label: 'All Requests', count: allRequests.length, color: 'default' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Leave Management
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage employee leave requests
          </p>
        </div>
        
<div className="mt-4 sm:mt-0">
          <Button icon="Plus" onClick={() => setShowCreateModal(true)}>
            New Leave Request
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending Approval</p>
              <p className="text-3xl font-bold">{pendingRequests.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Clock" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold">{approvedRequests.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="CheckCircle" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold">{rejectedRequests.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="XCircle" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold">{allRequests.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Calendar" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2
                ${activeTab === tab.key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span>{tab.label}</span>
              <Badge variant={tab.color} size="sm">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Leave Requests */}
      {filteredRequests.length === 0 ? (
        <Empty
          type="leave"
          title={`No ${activeTab} requests`}
          description={`There are no ${activeTab} leave requests at the moment.`}
          action={
            <Button icon="Plus">
              Create Leave Request
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request, index) => {
            const employee = employees.find(emp => emp.Id === request.employeeId);
            return (
              <motion.div
                key={request.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <LeaveRequestCard
                  request={request}
                  employee={employee}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              </motion.div>
            );
          })}
        </div>
)}

      {/* Create Leave Request Modal */}
      {showCreateModal && (
        <LeaveRequestModal
          employees={employees}
          onSubmit={handleCreateLeave}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

// Leave Request Modal Component
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

export default LeaveManagement;