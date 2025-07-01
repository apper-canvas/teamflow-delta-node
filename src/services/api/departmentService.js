import departmentData from '@/services/mockData/departments.json';

class DepartmentService {
  constructor() {
    this.departments = [...departmentData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.departments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const department = this.departments.find(dept => dept.Id === id);
    return department ? { ...department } : null;
  }

  async create(departmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.departments.map(dept => dept.Id), 0);
    const newDepartment = {
      ...departmentData,
      Id: maxId + 1
    };
    
    this.departments.push(newDepartment);
    return { ...newDepartment };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.departments.findIndex(dept => dept.Id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    
    this.departments[index] = { ...this.departments[index], ...updateData };
    return { ...this.departments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.departments.findIndex(dept => dept.Id === id);
    if (index === -1) {
      throw new Error('Department not found');
    }
    
    this.departments.splice(index, 1);
    return true;
  }
}

export const departmentService = new DepartmentService();