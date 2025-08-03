// reviewService.js - Service for handling product reviews
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ReviewService {
  // Get authorization headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Get reviews for a product
  async getProductReviews(productId) {
    try {
      const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.reviews;
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  // Create a new review
  async createReview(reviewData) {
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.review;
      } else {
        throw new Error(data.message || 'Failed to create review');
      }
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Update a review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.review;
      } else {
        throw new Error(data.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId) {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Mark review as helpful
  async markReviewHelpful(reviewId, isHelpful) {
    try {
      const response = await fetch(`${API_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ isHelpful })
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.review;
      } else {
        throw new Error(data.message || 'Failed to mark review as helpful');
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  }

  // Get user's reviews
  async getUserReviews() {
    try {
      const response = await fetch(`${API_URL}/reviews/user`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.reviews;
      } else {
        throw new Error(data.message || 'Failed to fetch user reviews');
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  // Get review statistics for a product
  async getReviewStats(productId) {
    try {
      const response = await fetch(`${API_URL}/reviews/product/${productId}/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (data.success) {
        return data.stats;
      } else {
        throw new Error(data.message || 'Failed to fetch review stats');
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }
}

const reviewService = new ReviewService();
export default reviewService;
