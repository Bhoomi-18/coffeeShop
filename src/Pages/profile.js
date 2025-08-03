import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import { updateProfile, addFavoriteOrder, removeFavoriteOrder } from '../Store/authSlice';
import Footer from '../componets/footer';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    preferences: {
      newsletter: false,
      notifications: true,
      favoriteStore: ''
    }
  });
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    totalReviews: 0,
    favoriteItems: 0
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        preferences: {
          newsletter: user.preferences?.newsletter || false,
          notifications: user.preferences?.notifications || true,
          favoriteStore: user.preferences?.favoriteStore || ''
        }
      });
      setFavorites(user.favoriteOrders || []);
      loadUserStats();
      loadUserOrders();
    }
  }, [user]);

  // Real-time stats loading
  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/profile/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // Load user orders
  const loadUserOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  // Real-time profile sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        loadUserStats();
        loadUserOrders();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully!');
      // Refresh stats after profile update
      setTimeout(() => {
        loadUserStats();
      }, 1000);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFavorite = async (index) => {
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
        setFavorites(data.favorites);
        dispatch(removeFavoriteOrder(index));
        toast.success('Removed from favorites');
        // Refresh stats
        loadUserStats();
      }
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  // Add to favorites from other pages (called via global state)
  const addToFavorites = async (item) => {
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
        setFavorites(data.favorites);
        dispatch(addFavoriteOrder(item));
        toast.success('Added to favorites');
        loadUserStats();
      }
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  // Listen for cart/order updates from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'orderCompleted' || e.key === 'cartUpdated') {
        loadUserStats();
        loadUserOrders();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for same-tab updates
    const handleCustomUpdate = () => {
      loadUserStats();
      loadUserOrders();
    };

    window.addEventListener('profileUpdate', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdate', handleCustomUpdate);
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Header */}
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  className="h-28 w-28 rounded-full object-cover border-4 border-amber-200 shadow-lg"
                  src={user.avatar || '/images/default-avatar.png'}
                  alt={user.name}
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg">
                    ⭐ {user.loyaltyPoints || 0} Loyalty Points
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    🗓️ Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✅ Active Account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <div className="text-4xl opacity-80">📦</div>
                </div>
                <div className="mt-2 text-blue-100 text-xs">
                  {stats.totalOrders > 0 ? 'Keep ordering!' : 'Place your first order'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Spent</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.totalSpent)}</p>
                  </div>
                  <div className="text-4xl opacity-80">💰</div>
                </div>
                <div className="mt-2 text-green-100 text-xs">
                  {stats.totalSpent > 100 ? 'Big spender!' : 'Start your journey'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg Order</p>
                    <p className="text-3xl font-bold">{formatCurrency(stats.averageOrderValue)}</p>
                  </div>
                  <div className="text-4xl opacity-80">📊</div>
                </div>
                <div className="mt-2 text-purple-100 text-xs">
                  {stats.averageOrderValue > 15 ? 'Premium choice' : 'Great value'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100 text-sm font-medium">Reviews</p>
                    <p className="text-3xl font-bold">{stats.totalReviews}</p>
                  </div>
                  <div className="text-4xl opacity-80">⭐</div>
                </div>
                <div className="mt-2 text-yellow-100 text-xs">
                  {stats.totalReviews > 5 ? 'Review master!' : 'Share your thoughts'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-red-500 overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:scale-105">
              <div className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium">Favorites</p>
                    <p className="text-3xl font-bold">{stats.favoriteItems}</p>
                  </div>
                  <div className="text-4xl opacity-80">❤️</div>
                </div>
                <div className="mt-2 text-pink-100 text-xs">
                  {stats.favoriteItems > 3 ? 'Favorite hunter!' : 'Find your favorites'}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50">
              <nav className="-mb-px flex space-x-0">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'profile'
                      ? 'border-amber-500 text-amber-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Edit Profile</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'favorites'
                      ? 'border-amber-500 text-amber-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>Favorites ({favorites.length})</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === 'orders'
                      ? 'border-amber-500 text-amber-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span>Order History ({orders.length})</span>
                  </span>
                </button>
              </nav>
            </div>

            {/* Enhanced Tab Content */}
            <div className="p-8">
              {activeTab === 'profile' && (
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h3>
                    <p className="text-gray-600">Update your personal information and preferences</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Personal Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                            required
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label htmlFor="favoriteStore" className="block text-sm font-medium text-gray-700 mb-2">
                            Favorite Store Location
                          </label>
                          <select
                            id="favoriteStore"
                            name="preferences.favoriteStore"
                            value={formData.preferences.favoriteStore}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                          >
                            <option value="">Select a location</option>
                            <option value="downtown">🏢 Downtown</option>
                            <option value="uptown">🏙️ Uptown</option>
                            <option value="westside">🌅 Westside</option>
                            <option value="eastside">🌄 Eastside</option>
                            <option value="mall">🛍️ Shopping Mall</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Communication Preferences
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="newsletter"
                              name="preferences.newsletter"
                              type="checkbox"
                              checked={formData.preferences.newsletter}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-all duration-200"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="newsletter" className="font-medium text-gray-900">
                              Newsletter Subscription
                            </label>
                            <p className="text-gray-500">Get updates on promotions, new menu items, and special events</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="notifications"
                              name="preferences.notifications"
                              type="checkbox"
                              checked={formData.preferences.notifications}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded transition-all duration-200"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="notifications" className="font-medium text-gray-900">
                              Order Notifications
                            </label>
                            <p className="text-gray-500">Receive real-time updates about your order status</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-500">
                        Last updated: {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Never'}
                      </p>
                      <button
                        type="submit"
                        disabled={loading || isUpdating}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {loading || isUpdating ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Update Profile
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="max-w-6xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Favorite Items</h3>
                    <p className="text-gray-600">Manage and reorder your favorite coffee selections</p>
                  </div>
                  
                  {favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h4>
                      <p className="text-gray-500 mb-6">
                        Add items to your favorites from the menu to see them here!
                      </p>
                      <a 
                        href="/shop" 
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Browse Menu
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((favorite, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 overflow-hidden">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-gray-900 mb-1">{favorite.name}</h4>
                                <p className="text-2xl font-bold text-amber-600">{formatCurrency(favorite.price)}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => addToFavorites(favorite)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                                  title="Reorder"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeFavorite(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  title="Remove from favorites"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            {favorite.customizations && favorite.customizations.length > 0 && (
                              <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Customizations:</p>
                                <div className="flex flex-wrap gap-1">
                                  {favorite.customizations.map((custom, i) => (
                                    <span key={i} className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                                      {custom}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                              <span className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                Added {new Date(favorite.orderDate).toLocaleDateString()}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                ❤️ Favorite
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="max-w-6xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Order History</h3>
                    <p className="text-gray-600">Track your past orders and reorder your favorites</p>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 7h-1V6a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v11a3 3 0 0 0 3 3h11.5a3.5 3.5 0 0 0 3.5-3.5V10a3 3 0 0 0-3-3zM6 4h8a2 2 0 0 1 2 2v1H6a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2zm10.5 14H5a1 1 0 0 1-1-1V8.83A3 3 0 0 0 6 9h10a1 1 0 0 1 1 1v6.5a1.5 1.5 0 0 1-1.5 1.5z"/>
                        </svg>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h4>
                      <p className="text-gray-500 mb-6">
                        Your order history will appear here once you place your first order!
                      </p>
                      <a 
                        href="/shop" 
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:shadow-lg transform transition-all duration-200 hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        Start Ordering
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">
                                  Order #{order.orderNumber || `ORD${index + 1}`}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">
                                  {formatCurrency(order.totalAmount)}
                                </p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {order.status || 'Unknown'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                              <h5 className="font-medium text-gray-900 mb-2">Items:</h5>
                              <div className="space-y-2">
                                {order.items && order.items.map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-700">
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                      {formatCurrency(item.price * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {order.storeLocation || 'Main Store'}
                              </div>
                              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transform transition-all duration-200 hover:scale-105">
                                Reorder
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Function to trigger profile updates from other components
export const triggerProfileUpdate = () => {
  const event = new CustomEvent('profileUpdate');
  window.dispatchEvent(event);
  
  // Also update localStorage to trigger cross-tab updates
  localStorage.setItem('profileUpdateTrigger', Date.now().toString());
};

export default Profile;
