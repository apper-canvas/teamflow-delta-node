import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import { employeeService } from '@/services/api/employeeService';
import { departmentService } from '@/services/api/departmentService';

const EmployeeForm = ({ employee = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    managerId: '',
    startDate: '',
    status: 'Active',
    photo: ''
  });
  
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadDepartments();
    loadEmployees();
    
    if (employee) {
      setFormData({
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        role: employee.role || '',
        department: employee.department || '',
        managerId: employee.managerId || '',
        startDate: employee.startDate ? employee.startDate.split('T')[0] : '',
        status: employee.status || 'Active',
        photo: employee.photo || ''
      });
    }
  }, [employee]);

  const loadDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (error) {
      toast.error('Failed to load departments');
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      toast.error('Failed to load employees');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        managerId: formData.managerId || null
      };
      
      await onSubmit(submitData);
      toast.success(employee ? 'Employee updated successfully' : 'Employee added successfully');
    } catch (error) {
      toast.error('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments.map(dept => ({
    value: dept.name,
    label: dept.name
  }));

  const managerOptions = employees
    .filter(emp => emp.Id !== employee?.Id)
    .map(emp => ({
      value: emp.Id.toString(),
      label: `${emp.firstName} ${emp.lastName}`
    }));

  const roleOptions = [
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'Senior Software Engineer', label: 'Senior Software Engineer' },
    { value: 'Team Lead', label: 'Team Lead' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'Designer', label: 'Designer' },
    { value: 'QA Engineer', label: 'QA Engineer' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Data Analyst', label: 'Data Analyst' },
    { value: 'HR Manager', label: 'HR Manager' },
    { value: 'Marketing Manager', label: 'Marketing Manager' },
    { value: 'Sales Representative', label: 'Sales Representative' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'On Leave', label: 'On Leave' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={errors.firstName}
          required
        />
        
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={errors.lastName}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
        />
        
        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          options={roleOptions}
          error={errors.role}
          required
        />
        
        <Select
          label="Department"
          value={formData.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          options={departmentOptions}
          error={errors.department}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Manager"
          value={formData.managerId}
          onChange={(e) => handleInputChange('managerId', e.target.value)}
          options={managerOptions}
          placeholder="Select Manager (Optional)"
        />
        
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          error={errors.startDate}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          options={statusOptions}
          required
        />
        
        <Input
          label="Photo URL"
          value={formData.photo}
          onChange={(e) => handleInputChange('photo', e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;