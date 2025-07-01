import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DepartmentCard from '@/components/molecules/DepartmentCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { departmentService } from '@/services/api/departmentService';
import { employeeService } from '@/services/api/employeeService';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [departmentsData, employeesData] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll()
      ]);
      
      setDepartments(departmentsData);
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load departments');
      console.error('Error loading departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentClick = (department) => {
    // Could navigate to department detail page or show more info
    toast.info(`Viewing ${department.name} department`);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Group employees by department for statistics
  const departmentStats = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department === dept.name);
    const activeEmployees = deptEmployees.filter(emp => emp.status === 'Active');
    const onLeaveEmployees = deptEmployees.filter(emp => emp.status === 'On Leave');
    
    return {
      ...dept,
      totalEmployees: deptEmployees.length,
      activeEmployees: activeEmployees.length,
      onLeaveEmployees: onLeaveEmployees.length,
      employeeList: deptEmployees
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Departments
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of all departments and their teams
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button icon="Plus">
            Add Department
          </Button>
        </div>
      </div>

      {/* Department Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Departments</p>
              <p className="text-3xl font-bold">{departments.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Building2" size={24} />
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
              <p className="text-green-100 text-sm font-medium">Total Employees</p>
              <p className="text-3xl font-bold">{employees.length}</p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="Users" size={24} />
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
              <p className="text-amber-100 text-sm font-medium">Avg per Department</p>
              <p className="text-3xl font-bold">
                {departments.length > 0 ? Math.round(employees.length / departments.length) : 0}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <ApperIcon name="BarChart3" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Department Cards */}
      {departmentStats.length === 0 ? (
        <Empty
          type="departments"
          action={
            <Button icon="Plus">
              Create First Department
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentStats.map((department, index) => (
            <motion.div
              key={department.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DepartmentCard
                department={department}
                employees={employees}
                onClick={() => handleDepartmentClick(department)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Department Hierarchy */}
      {departmentStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 font-display mb-6 flex items-center">
            <ApperIcon name="Sitemap" size={20} className="mr-2" />
            Organization Structure
          </h2>
          
          <div className="space-y-6">
            {departmentStats.map((dept) => (
              <div key={dept.Id} className="border-l-4 border-primary-500 pl-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{dept.totalEmployees} employees</span>
                    <span className="text-green-600">{dept.activeEmployees} active</span>
                    {dept.onLeaveEmployees > 0 && (
                      <span className="text-amber-600">{dept.onLeaveEmployees} on leave</span>
                    )}
                  </div>
                </div>
                
                {dept.employeeList.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dept.employeeList.map((employee) => (
                      <div
                        key={employee.Id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-700">
                            {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{employee.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Departments;