const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'coffee-shop-jwt-secret', {
    expiresIn: '7d'
  });
};

console.log('🛣️ Setting up auth routes...');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration request received');
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, email, and password' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    console.log('➕ Creating new user for:', email);
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: 'email',
      loyaltyPoints: 100 // Welcome bonus
    });
    
    console.log('✅ New user created:', user._id);
    
    // Generate JWT token
    const token = generateToken(user._id);
    console.log('🔑 JWT token generated');
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('🔐 Login request received');
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Check if user has a password (might be Google OAuth user)
    if (!user.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please login with Google or reset your password' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    console.log('✅ Login successful for:', user.email);
    
    // Generate JWT token
    const token = generateToken(user._id);
    console.log('🔑 JWT token generated');
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

console.log('🛣️ Setting up auth routes...');

// @route   POST /api/auth/google
// @desc    Authenticate with Google credential
// @access  Public
router.post('/google', async (req, res) => {
  try {
    console.log('📥 Google auth request received');
    const { credential } = req.body;
    
    if (!credential) {
      console.log('❌ No credential provided');
      return res.status(400).json({ success: false, message: 'Credential required' });
    }
    
    console.log('🔍 Verifying Google token...');
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    console.log('✅ Google token verified for:', payload.email);
    
    // Check if user exists by googleId first
    let user = await User.findOne({ googleId: payload.sub });
    
    if (!user) {
      // Check if user exists by email (might be an email-registered user)
      const existingEmailUser = await User.findOne({ email: payload.email });
      
      if (existingEmailUser && !existingEmailUser.googleId) {
        // Update existing email user with Google info
        console.log('🔄 Linking Google account to existing email user:', payload.email);
        user = await User.findByIdAndUpdate(
          existingEmailUser._id,
          {
            googleId: payload.sub,
            avatar: payload.picture,
            provider: 'google' // Update provider to indicate Google linking
          },
          { new: true }
        );
        console.log('✅ Existing user updated with Google info:', user._id);
      } else if (existingEmailUser && existingEmailUser.googleId) {
        // User already has Google linked but googleId doesn't match
        console.log('⚠️ Email already registered with different Google account');
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered with a different Google account' 
        });
      } else {
        // Create completely new user
        console.log('➕ Creating new user for:', payload.email);
        try {
          user = await User.create({
            googleId: payload.sub,
            name: payload.name,
            email: payload.email,
            avatar: payload.picture,
            provider: 'google',
            loyaltyPoints: 100 // Welcome bonus
          });
          console.log('✅ New user created:', user._id);
        } catch (createError) {
          if (createError.code === 11000) {
            // Handle duplicate key error gracefully
            console.log('🔄 Duplicate key error, trying to find existing user...');
            user = await User.findOne({ 
              $or: [
                { googleId: payload.sub },
                { email: payload.email }
              ]
            });
            if (!user) {
              throw createError; // Re-throw if we still can't find the user
            }
            console.log('✅ Found existing user after duplicate error:', user._id);
          } else {
            throw createError;
          }
        }
      }
    } else {
      console.log('👤 Existing user found:', user._id);
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    console.log('🔑 JWT token generated');
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        loyaltyPoints: user.loyaltyPoints,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({ success: false, message: 'Authentication failed' });
  }
});

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-googleId');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    console.log('📝 Profile update request for user:', req.user.id);
    const { name, preferences, favoriteStore } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (preferences) updateData.preferences = { ...preferences };
    if (favoriteStore) updateData['preferences.favoriteStore'] = favoriteStore;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-googleId');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('✅ Profile updated for:', user.email);
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Profile update failed' });
  }
});

// @route   GET /api/auth/profile/stats
// @desc    Get user profile statistics
// @access  Private
router.get('/profile/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get order statistics
    const Order = require('../models/order');
    const Review = require('../models/review');
    
    const [orderStats, reviewStats, favoriteCount] = await Promise.all([
      Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            averageOrderValue: { $avg: '$total' }
          }
        }
      ]),
      Review.countDocuments({ user: userId }),
      User.findById(userId).then(user => user.favoriteOrders.length)
    ]);
    
    const stats = {
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalSpent: orderStats[0]?.totalSpent || 0,
      averageOrderValue: orderStats[0]?.averageOrderValue || 0,
      totalReviews: reviewStats,
      favoriteItems: favoriteCount
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

// @route   POST /api/auth/favorites
// @desc    Add item to favorites
// @access  Private
router.post('/favorites', authMiddleware, async (req, res) => {
  try {
    const { name, price, customizations = [] } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Check if already in favorites
    const existingFavorite = user.favoriteOrders.find(
      fav => fav.name === name && JSON.stringify(fav.customizations) === JSON.stringify(customizations)
    );
    
    if (existingFavorite) {
      return res.status(400).json({ success: false, message: 'Item already in favorites' });
    }
    
    user.favoriteOrders.push({
      name,
      price,
      customizations,
      orderDate: new Date()
    });
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Added to favorites',
      favorites: user.favoriteOrders 
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ success: false, message: 'Failed to add favorite' });
  }
});

// @route   DELETE /api/auth/favorites/:index
// @desc    Remove item from favorites
// @access  Private
router.delete('/favorites/:index', authMiddleware, async (req, res) => {
  try {
    const { index } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (index < 0 || index >= user.favoriteOrders.length) {
      return res.status(400).json({ success: false, message: 'Invalid favorite index' });
    }
    
    user.favoriteOrders.splice(index, 1);
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Removed from favorites',
      favorites: user.favoriteOrders 
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove favorite' });
  }
});

// @route   PUT /api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body },
      { new: true }
    );
    res.json({ success: true, preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
});

// @route   POST /api/auth/loyalty/add
// @desc    Add loyalty points
// @access  Private
router.post('/loyalty/add', authMiddleware, async (req, res) => {
  try {
    const { points, orderId } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid points value' 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Add loyalty points
    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
    
    // Save the updated user
    await user.save();
    
    res.json({ 
      success: true, 
      message: `Added ${points} loyalty points`,
      totalPoints: user.loyaltyPoints,
      addedPoints: points,
      orderId 
    });
  } catch (error) {
    console.error('Loyalty points add error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add loyalty points' 
    });
  }
});

module.exports = router;