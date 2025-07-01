import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { employeeService } from '@/services/api/employeeService';
import { departmentService } from '@/services/api/departmentService';
import { leaveService } from '@/services/api/leaveService';
import { format, subMonths, isAfter } from 'date-fns';

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      setError('Failed to load report data');
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Department Distribution Chart
  const departmentData = departments.map(dept => {
    const count = employees.filter(emp => emp.department === dept.name).length;
    return { name: dept.name, count };
  });

  const departmentChartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false }
    },
    labels: departmentData.map(d => d.name),
    colors: ['#2563eb', '#7c3aed', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%';
      }
    }
  };

  // Employee Status Chart
  const statusData = [
    { name: 'Active', count: employees.filter(emp => emp.status === 'Active').length },
    { name: 'On Leave', count: employees.filter(emp => emp.status === 'On Leave').length },
    { name: 'Inactive', count: employees.filter(emp => emp.status === 'Inactive').length }
  ];

  const statusChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    xaxis: {
      categories: statusData.map(s => s.name)
    },
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%'
      }
    },
    dataLabels: {
      enabled: false
    }
  };

  // Leave Trends Chart (Last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return format(date, 'MMM yyyy');
  }).reverse();

  const leaveTrendsData = last6Months.map(month => {
    const monthRequests = leaveRequests.filter(req => {
      const requestMonth = format(new Date(req.startDate), 'MMM yyyy');
      return requestMonth === month;
    });
    return monthRequests.length;
  });

  const leaveTrendsOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false }
    },
    xaxis: {
      categories: last6Months
    },
    colors: ['#2563eb'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 6
    },
    grid: {
      borderColor: '#f1f5f9'
    }
  };

  // Recent Hires (Last 3 months)
  const threeMonthsAgo = subMonths(new Date(), 3);
  const recentHires = employees.filter(emp => 
    isAfter(new Date(emp.startDate), threeMonthsAgo)
  );

  // Leave Statistics
  const leaveStats = {
    total: leaveRequests.length,
    approved: leaveRequests.filter(req => req.status === 'Approved').length,
    pending: leaveRequests.filter(req => req.status === 'Pending').length,
    rejected: leaveRequests.filter(req => req.status === 'Rejected').length
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    alert('Report export feature would be implemented here');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Insights and analytics for your HR data
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" icon="Filter">
            Filter Reports
          </Button>
          <Button icon="Download" onClick={handleExportReport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold">{employees.length}</p>
              <p className="text-primary-200 text-xs mt-1">
                {recentHires.length} hired in last 3 months
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Users" size={24} />
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
              <p className="text-green-100 text-sm font-medium">Active Employees</p>
              <p className="text-3xl font-bold">{statusData[0].count}</p>
              <p className="text-green-200 text-xs mt-1">
                {((statusData[0].count / employees.length) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="UserCheck" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Leave Requests</p>
              <p className="text-3xl font-bold">{leaveStats.total}</p>
              <p className="text-amber-200 text-xs mt-1">
                {leaveStats.pending} pending approval
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Calendar" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium">Departments</p>
              <p className="text-3xl font-bold">{departments.length}</p>
              <p className="text-secondary-200 text-xs mt-1">
                Avg {Math.round(employees.length / departments.length)} employees/dept
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Building2" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-4 flex items-center">
            <ApperIcon name="PieChart" size={20} className="mr-2" />
            Employee Distribution by Department
          </h2>
          <Chart
            options={departmentChartOptions}
            series={departmentData.map(d => d.count)}
            type="donut"
            height={300}
          />
        </motion.div>

        {/* Employee Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-4 flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2" />
            Employee Status Overview
          </h2>
          <Chart
            options={statusChartOptions}
            series={[{ data: statusData.map(s => s.count) }]}
            type="bar"
            height={300}
          />
        </motion.div>
      </div>

      {/* Leave Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
      >
        <h2 className="text-xl font-semibold text-gray-900 font-display mb-4 flex items-center">
          <ApperIcon name="TrendingUp" size={20} className="mr-2" />
          Leave Request Trends (Last 6 Months)
        </h2>
        <Chart
          options={leaveTrendsOptions}
          series={[{ name: 'Leave Requests', data: leaveTrendsData }]}
          type="line"
          height={300}
        />
      </motion.div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-4 flex items-center">
            <ApperIcon name="UserPlus" size={20} className="mr-2" />
            Recent Hires (Last 3 Months)
          </h2>
          
          {recentHires.length > 0 ? (
            <div className="space-y-3">
              {recentHires.slice(0, 5).map((employee) => (
                <div key={employee.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                    <p className="text-xs text-gray-500">{employee.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(employee.startDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
              {recentHires.length > 5 && (
                <p className="text-sm text-gray-500 text-center">
                  +{recentHires.length - 5} more recent hires
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent hires in the last 3 months</p>
          )}
        </motion.div>

        {/* Department Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-4 flex items-center">
            <ApperIcon name="Building2" size={20} className="mr-2" />
            Department Statistics
          </h2>
          
          <div className="space-y-3">
            {departmentData.map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{dept.name}</p>
                  <p className="text-sm text-gray-600">
                    {((dept.count / employees.length) * 100).toFixed(1)}% of total workforce
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{dept.count}</p>
                  <p className="text-xs text-gray-500">employees</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;