const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['coffee', 'tea', 'pastry', 'sandwich', 'dessert', 'beverage']
  },
  image: {
    type: String,
    required: true
  },
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    sugar: Number
  },
  customizable: {
    type: Boolean,
    default: false
  },
  customizations: [{
    type: { type: String }, // size, milk, syrup, etc.
    options: [{
      name: String,
      priceModifier: { type: Number, default: 0 }
    }]
  }],
  available: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number, // in minutes
    default: 5
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, available: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ 'ratings.average': -1 });

module.exports = mongoose.model('Product', productSchema);
