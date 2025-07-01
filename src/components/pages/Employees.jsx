import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import EmployeeCard from '@/components/molecules/EmployeeCard';
import SearchBar from '@/components/molecules/SearchBar';
import EmployeeForm from '@/components/organisms/EmployeeForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { employeeService } from '@/services/api/employeeService';
import { departmentService } from '@/services/api/departmentService';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [employeesData, departmentsData] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll()
      ]);
      
      setEmployees(employeesData);
      setDepartments(departmentsData);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(employee => employee[key] === value);
      }
    });

    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      try {
        await employeeService.delete(employee.Id);
        setEmployees(prev => prev.filter(emp => emp.Id !== employee.Id));
        toast.success('Employee deleted successfully');
      } catch (error) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        const updatedEmployee = await employeeService.update(editingEmployee.Id, formData);
        setEmployees(prev => prev.map(emp => emp.Id === editingEmployee.Id ? updatedEmployee : emp));
      } else {
        const newEmployee = await employeeService.create(formData);
        setEmployees(prev => [...prev, newEmployee]);
      }
      
      setShowForm(false);
      setEditingEmployee(null);
    } catch (error) {
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const searchFilters = [
    {
      key: 'department',
      label: 'Department',
      options: departments.map(dept => ({ value: dept.name, label: dept.name }))
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'On Leave', label: 'On Leave' }
      ]
    }
  ];

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Employees
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your team members and their information
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex rounded-lg border border-gray-200 bg-white">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'cards' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ApperIcon name="Grid3X3" size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ApperIcon name="List" size={16} />
            </button>
          </div>
          
          <Button
            icon="Plus"
            onClick={handleAddEmployee}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={searchFilters}
        activeFilters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        onClearFilters={() => setFilters({})}
        placeholder="Search employees by name, email, role, or department..."
      />

      {/* Employee Grid/List */}
      <AnimatePresence mode="wait">
        {filteredEmployees.length === 0 && !loading ? (
          <Empty
            type="employees"
            action={
              <Button icon="Plus" onClick={handleAddEmployee}>
                Add First Employee
              </Button>
            }
          />
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'cards'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EmployeeCard
                  employee={employee}
                  onEdit={handleEditEmployee}
                  onDelete={handleDeleteEmployee}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 font-display">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
              </div>
              
              <div className="p-6">
                <EmployeeForm
                  employee={editingEmployee}
                  onSubmit={handleFormSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Employees;