const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, // This allows multiple null values but unique non-null values
    default: undefined // Use undefined instead of null to work with sparse index
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'email'; // Only required for email registration
    }
  },
  avatar: {
    type: String
  },
  provider: {
    type: String,
    enum: ['google', 'email'],
    default: 'email'
  },
  loyaltyPoints: {
    type: Number,
    default: 100
  },
  favoriteOrders: [{
    name: String,
    price: Number,
    customizations: [String],
    orderDate: { type: Date, default: Date.now }
  }],
  preferences: {
    newsletter: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    favoriteStore: String
  },
  orderHistory: [{
    orderId: String,
    items: [Object],
    total: Number,
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: 'completed' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);