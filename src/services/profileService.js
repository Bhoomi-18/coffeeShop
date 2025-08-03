// profileService.js - Real-time profile update utilities
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const ProfileService = {
  // Trigger profile updates across the app
  triggerUpdate: () => {
    const event = new CustomEvent('profileUpdate');
    window.dispatchEvent(event);
    
    // Cross-tab communication
    localStorage.setItem('profileUpdateTrigger', Date.now().toString());
  },

  // Update loyalty points after purchase
  updateLoyaltyPoints: async (points, orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/loyalty/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ points, orderId })
      });
      
      const data = await response.json();
      if (data.success) {
        ProfileService.triggerUpdate();
        return data;
      }
    } catch (error) {
      console.error('Failed to update loyalty points:', error);
    }
  },

  // Add item to favorites
  addToFavorites: async (item) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/favorites`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      });
      
      const data = await response.json();
      if (data.success) {
        ProfileService.triggerUpdate();
        return data;
      }
    } catch (error) {
      console.error('Failed to add to favorites:', error);
    }
  },

  // Remove from favorites
  removeFromFavorites: async (index) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/favorites/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        ProfileService.triggerUpdate();
        return data;
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  },

  // Notify about order completion
  orderCompleted: (orderData) => {
    // Calculate loyalty points (10% of order value)
    const loyaltyPoints = Math.floor(orderData.totalAmount * 0.1);
    
    if (loyaltyPoints > 0) {
      ProfileService.updateLoyaltyPoints(loyaltyPoints, orderData.id);
    }
    
    // Trigger general update
    ProfileService.triggerUpdate();
    
    // Store order completion for real-time updates
    localStorage.setItem('orderCompleted', JSON.stringify({
      ...orderData,
      timestamp: Date.now()
    }));
  },

  // Notify about cart updates
  cartUpdated: (cartData) => {
    ProfileService.triggerUpdate();
    localStorage.setItem('cartUpdated', JSON.stringify({
      ...cartData,
      timestamp: Date.now()
    }));
  },

  // Get user stats in real-time
  getUserStats: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/profile/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        return data.stats;
      }
    } catch (error) {
      console.error('Failed to get user stats:', error);
    }
    return null;
  },

  // Listen for real-time updates
  onProfileUpdate: (callback) => {
    const handleUpdate = () => callback();
    const handleStorageChange = (e) => {
      if (e.key === 'profileUpdateTrigger' || e.key === 'orderCompleted' || e.key === 'cartUpdated') {
        callback();
      }
    };

    window.addEventListener('profileUpdate', handleUpdate);
    window.addEventListener('storage', handleStorageChange);

    // Return cleanup function
    return () => {
      window.removeEventListener('profileUpdate', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }
};

export default ProfileService;
