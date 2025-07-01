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
          <Button icon="Plus">
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
    </div>
  );
};

export default LeaveManagement;