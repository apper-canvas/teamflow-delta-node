import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { employeeService } from '@/services/api/employeeService';
import { leaveService } from '@/services/api/leaveService';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEmployeeData();
  }, [id]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [employeeData, leaveData] = await Promise.all([
        employeeService.getById(parseInt(id)),
        leaveService.getAll()
      ]);
      
      if (!employeeData) {
        setError('Employee not found');
        return;
      }
      
      setEmployee(employeeData);
      setLeaveHistory(leaveData.filter(leave => leave.employeeId === parseInt(id)));
    } catch (err) {
      setError('Failed to load employee details');
      console.error('Error loading employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate('/employees', { state: { editEmployee: employee } });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        toast.success('Employee deleted successfully');
        navigate('/employees');
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEmployeeData} />;
  if (!employee) return <Error message="Employee not found" />;

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on leave': return 'warning';
      default: return 'default';
    }
  };

  const getLeaveStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button
        variant="ghost"
        icon="ArrowLeft"
        onClick={() => navigate('/employees')}
      >
        Back to Employees
      </Button>

      {/* Employee Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-start space-x-6">
            <div className="relative">
              {employee.photo ? (
                <img
                  src={employee.photo}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <ApperIcon name="User" size={36} className="text-primary-600" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-xl text-gray-600 mb-3">{employee.role}</p>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant={getStatusVariant(employee.status)}>
                  {employee.status}
                </Badge>
                <span className="text-gray-500">{employee.department}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-3">
            <Button variant="outline" icon="Edit" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="danger" icon="Trash2" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Employee Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center">
            <ApperIcon name="User" size={20} className="mr-2" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="text-gray-900 font-medium">{employee.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="text-gray-900 font-medium">{employee.lastName}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Email Address</label>
              <p className="text-gray-900 font-medium flex items-center">
                <ApperIcon name="Mail" size={16} className="mr-2 text-gray-400" />
                {employee.email}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Phone Number</label>
              <p className="text-gray-900 font-medium flex items-center">
                <ApperIcon name="Phone" size={16} className="mr-2 text-gray-400" />
                {employee.phone}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Employment Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center">
            <ApperIcon name="Building2" size={20} className="mr-2" />
            Employment Details
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Job Title</label>
              <p className="text-gray-900 font-medium">{employee.role}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Department</label>
              <p className="text-gray-900 font-medium">{employee.department}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Start Date</label>
              <p className="text-gray-900 font-medium flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-2 text-gray-400" />
                {format(new Date(employee.startDate), 'MMMM dd, yyyy')}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Employment Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Leave History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center">
          <ApperIcon name="Calendar" size={20} className="mr-2" />
          Leave History
        </h2>
        
        {leaveHistory.length > 0 ? (
          <div className="space-y-4">
            {leaveHistory.map((leave) => (
              <div key={leave.Id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{leave.type} Leave</h3>
                    <Badge variant={getLeaveStatusVariant(leave.status)} size="sm">
                      {leave.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                {leave.reason && (
                  <p className="text-gray-600 text-sm mb-2">{leave.reason}</p>
                )}
                
                {leave.approvedBy && (
                  <p className="text-xs text-gray-500">
                    {leave.status} by {leave.approvedBy}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No leave history found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EmployeeDetail;