import employeeData from '@/services/mockData/employees.json';
import leaveData from '@/services/mockData/leaveRequests.json';

class NotificationService {
  constructor() {
    this.activities = this.generateMockActivities();
  }

  generateMockActivities() {
    const activities = [];
    let id = 1;

    // Generate employee-related activities
    employeeData.forEach(employee => {
      // New employee activities
      const joinDate = new Date(employee.startDate);
      const now = new Date();
      const daysSinceJoin = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceJoin < 30) {
        activities.push({
          Id: id++,
          type: 'employee_created',
          employeeId: employee.Id,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeePhoto: employee.photo,
          description: `joined the ${employee.department} department as ${employee.role}`,
          timestamp: new Date(joinDate.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          read: Math.random() > 0.3
        });
      }

      // Random employee updates
      if (Math.random() > 0.7) {
        activities.push({
          Id: id++,
          type: 'employee_updated',
          employeeId: employee.Id,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeePhoto: employee.photo,
          description: 'updated their profile information',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          read: Math.random() > 0.4
        });
      }
    });

    // Generate leave-related activities
    leaveData.forEach(leave => {
      const employee = employeeData.find(emp => emp.Id === leave.employeeId);
      if (!employee) return;

      // Leave request activity
      activities.push({
        Id: id++,
        type: 'leave_requested',
        employeeId: leave.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeePhoto: employee.photo,
        description: `requested ${leave.type.toLowerCase()} leave from ${leave.startDate} to ${leave.endDate}`,
        timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        read: Math.random() > 0.3
      });

      // Leave status update activity
      if (leave.status !== 'Pending') {
        activities.push({
          Id: id++,
          type: leave.status === 'Approved' ? 'leave_approved' : 'leave_rejected',
          employeeId: leave.employeeId,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          employeePhoto: employee.photo,
          description: `${leave.type.toLowerCase()} leave request was ${leave.status.toLowerCase()}${leave.approvedBy ? ` by ${leave.approvedBy}` : ''}`,
          timestamp: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
          read: Math.random() > 0.5
        });
      }
    });

    // Sort by timestamp (newest first) and limit to 20 activities
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 20);
  }

  async getRecentActivities() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.activities];
  }

  async markAsRead(activityId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const activity = this.activities.find(a => a.Id === activityId);
    if (activity) {
      activity.read = true;
    }
    return activity;
  }

  async markAllAsRead() {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.activities.forEach(activity => {
      activity.read = true;
    });
    return true;
  }

  getUnreadCount() {
    return this.activities.filter(activity => !activity.read).length;
  }
}

export const notificationService = new NotificationService();