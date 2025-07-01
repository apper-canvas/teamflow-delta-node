import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { employeeService } from '@/services/api/employeeService';
import { departmentService } from '@/services/api/departmentService';
import { leaveService } from '@/services/api/leaveService';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [employeesData, departmentsData, leaveData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        leaveService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
      setLeaveRequests(leaveData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const employeesOnLeave = employees.filter(emp => emp.status === 'On Leave').length;
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'Pending').length;
  
  // Recent activity
  const recentHires = employees
    .filter(emp => {
      const hireDate = new Date(emp.startDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return hireDate >= thirtyDaysAgo;
    })
    .slice(0, 5);

  const upcomingLeave = leaveRequests
    .filter(req => {
      const startDate = new Date(req.startDate);
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return req.status === 'Approved' && startDate >= now && startDate <= nextWeek;
    })
    .slice(0, 5);

  // Department distribution
  const departmentStats = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.name);
    return {
      name: dept.name,
      count: deptEmployees.length,
      active: deptEmployees.filter(emp => emp.status === 'Active').length
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's what's happening with your team.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center text-sm text-gray-500">
          <ApperIcon name="Calendar" size={16} className="mr-2" />
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          icon="Users"
          gradient="primary"
          change="+12% from last month"
          changeType="positive"
        />
        
        <StatCard
          title="Active Employees"
          value={activeEmployees}
          icon="UserCheck"
          gradient="success"
          change={`${((activeEmployees / totalEmployees) * 100).toFixed(1)}% of total`}
          changeType="neutral"
        />
        
        <StatCard
          title="On Leave Today"
          value={employeesOnLeave}
          icon="Calendar"
          gradient="warning"
          change={employeesOnLeave > 0 ? "Manage coverage" : "All hands on deck"}
          changeType={employeesOnLeave > 5 ? "negative" : "neutral"}
        />
        
        <StatCard
          title="Pending Requests"
          value={pendingLeaveRequests}
          icon="Clock"
          gradient="info"
          change={pendingLeaveRequests > 0 ? "Needs attention" : "All caught up"}
          changeType={pendingLeaveRequests > 3 ? "negative" : "positive"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Hires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 font-display">
              Recent Hires
            </h2>
            <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
              <ApperIcon name="UserPlus" size={20} className="text-green-600" />
            </div>
          </div>
          
          {recentHires.length > 0 ? (
            <div className="space-y-4">
              {recentHires.map((employee) => (
                <div key={employee.Id} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-700">
                      {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                    <p className="text-xs text-gray-500">{employee.department}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(employee.startDate), 'MMM dd')}
                    </p>
                    <p className="text-xs text-gray-500">Started</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent hires in the last 30 days</p>
            </div>
          )}
        </motion.div>

        {/* Upcoming Leave */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 font-display">
              Upcoming Leave
            </h2>
            <div className="p-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg">
              <ApperIcon name="Calendar" size={20} className="text-amber-600" />
            </div>
          </div>
          
          {upcomingLeave.length > 0 ? (
            <div className="space-y-4">
              {upcomingLeave.map((request) => {
                const employee = employees.find(emp => emp.Id === request.employeeId);
                return (
                  <div key={request.Id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-amber-700">
                        {employee?.firstName?.charAt(0)}{employee?.lastName?.charAt(0)}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {employee?.firstName} {employee?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{request.type} Leave</p>
                      <p className="text-xs text-gray-500">{employee?.department}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {format(new Date(request.startDate), 'MMM dd')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(request.startDate), 'MMM dd')} - {format(new Date(request.endDate), 'MMM dd')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming leave in the next week</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Department Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 font-display">
            Department Overview
          </h2>
          <div className="p-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg">
            <ApperIcon name="Building2" size={20} className="text-primary-600" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.map((dept) => (
            <div key={dept.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{dept.name}</h3>
                <span className="text-2xl font-bold text-primary-600">{dept.count}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active: {dept.active}</span>
                <span className="text-gray-500">
                  {dept.count > 0 ? `${((dept.active / dept.count) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>
              
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: dept.count > 0 ? `${(dept.active / dept.count) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;