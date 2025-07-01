import leaveData from '@/services/mockData/leaveRequests.json';

class LeaveService {
  constructor() {
    this.leaveRequests = [...leaveData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.leaveRequests];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const request = this.leaveRequests.find(req => req.Id === id);
    return request ? { ...request } : null;
  }

  async create(requestData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.leaveRequests.map(req => req.Id), 0);
    const newRequest = {
      ...requestData,
      Id: maxId + 1,
      status: 'Pending'
    };
    
    this.leaveRequests.push(newRequest);
    return { ...newRequest };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.leaveRequests.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error('Leave request not found');
    }
    
    this.leaveRequests[index] = { ...this.leaveRequests[index], ...updateData };
    return { ...this.leaveRequests[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.leaveRequests.findIndex(req => req.Id === id);
    if (index === -1) {
      throw new Error('Leave request not found');
    }
    
    this.leaveRequests.splice(index, 1);
    return true;
  }
}

export const leaveService = new LeaveService();