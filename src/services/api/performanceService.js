import performanceData from '@/services/mockData/performanceReviews.json';

class PerformanceService {
  constructor() {
    this.reviews = [...performanceData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.reviews];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const review = this.reviews.find(review => review.Id === id);
    return review ? { ...review } : null;
  }

  async getByEmployeeId(employeeId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.reviews.filter(review => review.employeeId === employeeId).map(review => ({ ...review }));
  }

  async create(reviewData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const maxId = Math.max(...this.reviews.map(review => review.Id), 0);
    const newReview = {
      ...reviewData,
      Id: maxId + 1
    };
    
    this.reviews.push(newReview);
    return { ...newReview };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.reviews.findIndex(review => review.Id === id);
    if (index === -1) {
      throw new Error('Performance review not found');
    }
    
    this.reviews[index] = { ...this.reviews[index], ...updateData };
    return { ...this.reviews[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.reviews.findIndex(review => review.Id === id);
    if (index === -1) {
      throw new Error('Performance review not found');
    }
    
    this.reviews.splice(index, 1);
    return true;
  }
}

export const performanceService = new PerformanceService();