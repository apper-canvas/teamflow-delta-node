import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import StarRating from '@/components/molecules/StarRating';
import ProgressBar from '@/components/molecules/ProgressBar';
import { performanceService } from '@/services/api/performanceService';
import { employeeService } from '@/services/api/employeeService';

const PerformanceReviews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewPeriod: '',
    overallRating: 0,
    technicalSkills: 0,
    communication: 0,
    leadership: 0,
    teamwork: 0,
    problemSolving: 0,
    goals: '',
    achievements: '',
    areasForImprovement: '',
    feedback: '',
    reviewerName: ''
  });

  useEffect(() => {
    loadData();
    
    // Check if we need to open form for specific employee
    if (location.state?.employeeId) {
      setFormData(prev => ({ ...prev, employeeId: location.state.employeeId }));
      setShowForm(true);
    }
  }, [location.state]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [reviewsData, employeesData] = await Promise.all([
        performanceService.getAll(),
        employeeService.getAll()
      ]);
      
      setReviews(reviewsData);
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load performance reviews');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.reviewPeriod || !formData.overallRating) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const reviewData = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
        reviewDate: new Date().toISOString().split('T')[0]
      };

      if (editingReview) {
        await performanceService.update(editingReview.Id, reviewData);
        toast.success('Performance review updated successfully');
      } else {
        await performanceService.create(reviewData);
        toast.success('Performance review created successfully');
      }

      resetForm();
      loadData();
    } catch (error) {
      toast.error('Failed to save performance review');
      console.error('Error saving review:', error);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      employeeId: review.employeeId.toString(),
      reviewPeriod: review.reviewPeriod,
      overallRating: review.overallRating,
      technicalSkills: review.technicalSkills,
      communication: review.communication,
      leadership: review.leadership,
      teamwork: review.teamwork,
      problemSolving: review.problemSolving,
      goals: review.goals,
      achievements: review.achievements,
      areasForImprovement: review.areasForImprovement,
      feedback: review.feedback,
      reviewerName: review.reviewerName
    });
    setShowForm(true);
  };

  const handleDelete = async (review) => {
    const employee = employees.find(emp => emp.Id === review.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    
    if (window.confirm(`Are you sure you want to delete the ${review.reviewPeriod} review for ${employeeName}?`)) {
      try {
        await performanceService.delete(review.Id);
        toast.success('Performance review deleted successfully');
        loadData();
      } catch (error) {
        toast.error('Failed to delete performance review');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      reviewPeriod: '',
      overallRating: 0,
      technicalSkills: 0,
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problemSolving: 0,
      goals: '',
      achievements: '',
      areasForImprovement: '',
      feedback: '',
      reviewerName: ''
    });
    setEditingReview(null);
    setShowForm(false);
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.Id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const getEmployeeRole = (employeeId) => {
    const employee = employees.find(emp => emp.Id === employeeId);
    return employee ? employee.role : 'Unknown Role';
  };

  const filteredReviews = reviews.filter(review => {
    const employee = employees.find(emp => emp.Id === review.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}`.toLowerCase() : '';
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) || 
                         review.reviewPeriod.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEmployee = !selectedEmployee || review.employeeId.toString() === selectedEmployee;
    const matchesPeriod = filterPeriod === 'all' || review.reviewPeriod.includes(filterPeriod);
    
    return matchesSearch && matchesEmployee && matchesPeriod;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Performance Reviews</h1>
          <p className="text-gray-600 mt-1">Manage employee performance evaluations and feedback</p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0"
        >
          Add Review
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
          <Select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees.map(employee => (
              <option key={employee.Id} value={employee.Id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </Select>
          <Select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">All Periods</option>
            <option value="2024">2024</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </Select>
          <Button
            variant="outline"
            icon="RefreshCw"
            onClick={loadData}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingReview ? 'Edit Performance Review' : 'Add Performance Review'}
                </h2>
                <Button variant="ghost" icon="X" onClick={resetForm} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Employee *"
                  value={formData.employeeId}
                  onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.Id} value={employee.Id}>
                      {employee.firstName} {employee.lastName} - {employee.role}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Review Period *"
                  placeholder="e.g., Q3 2024, Annual 2024"
                  value={formData.reviewPeriod}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewPeriod: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Rating *
                </label>
                <StarRating
                  rating={formData.overallRating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, overallRating: rating }))}
                  size={24}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Skills
                  </label>
                  <StarRating
                    rating={formData.technicalSkills}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, technicalSkills: rating }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication
                  </label>
                  <StarRating
                    rating={formData.communication}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, communication: rating }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leadership
                  </label>
                  <StarRating
                    rating={formData.leadership}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, leadership: rating }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teamwork
                  </label>
                  <StarRating
                    rating={formData.teamwork}
                    onRatingChange={(rating) => setFormData(prev => ({ ...prev, teamwork: rating }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goals & Objectives
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Goals set for this review period..."
                    value={formData.goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Achievements
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Notable achievements and accomplishments..."
                    value={formData.achievements}
                    onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas for Improvement
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="3"
                    placeholder="Areas that need development..."
                    value={formData.areasForImprovement}
                    onChange={(e) => setFormData(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    General Feedback
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows="4"
                    placeholder="Additional feedback and comments..."
                    value={formData.feedback}
                    onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                  />
                </div>

                <Input
                  label="Reviewer Name"
                  placeholder="Name of the reviewer"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingReview ? 'Update Review' : 'Create Review'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        {filteredReviews.length === 0 ? (
          <Empty
            icon="Star"
            title="No Performance Reviews"
            description="No performance reviews found. Create your first review to get started."
            actionLabel="Add Review"
            onAction={() => setShowForm(true)}
          />
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getEmployeeName(review.employeeId)}
                      </h3>
                      <Badge variant="info" size="sm">
                        {review.reviewPeriod}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <StarRating rating={review.overallRating} readOnly size={16} />
                        <span className="text-sm text-gray-600 ml-2">
                          {review.overallRating}/5
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{getEmployeeRole(review.employeeId)}</p>
                    
                    {review.feedback && (
                      <p className="text-gray-700 mb-3 line-clamp-2">{review.feedback}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Technical</div>
                        <div className="flex justify-center">
                          <StarRating rating={review.technicalSkills} readOnly size={14} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Communication</div>
                        <div className="flex justify-center">
                          <StarRating rating={review.communication} readOnly size={14} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Leadership</div>
                        <div className="flex justify-center">
                          <StarRating rating={review.leadership} readOnly size={14} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">Teamwork</div>
                        <div className="flex justify-center">
                          <StarRating rating={review.teamwork} readOnly size={14} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <ApperIcon name="Calendar" size={14} className="mr-1" />
                      Reviewed on {format(new Date(review.reviewDate), 'MMM dd, yyyy')}
                      {review.reviewerName && (
                        <>
                          <span className="mx-2">•</span>
                          <ApperIcon name="User" size={14} className="mr-1" />
                          by {review.reviewerName}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Edit"
                      onClick={() => handleEdit(review)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(review)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceReviews;