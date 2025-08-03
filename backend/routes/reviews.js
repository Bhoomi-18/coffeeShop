const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/review');
const Product = require('../models/product');
const Order = require('../models/order');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // Check if user has ordered this product
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      'items.product': productId,
      status: 'completed'
    });

    const verified = !!order;

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      order: orderId,
      rating,
      comment,
      verified
    });

    // Update product rating
    await updateProductRating(productId);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.status(201).json({ success: true, data: populatedReview });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(400).json({ success: false, message: 'Review creation failed' });
  }
});

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: req.params.productId });

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(req.params.productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total
      },
      ratingDistribution
    });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.json({ success: true, data: populatedReview });
  } catch (error) {
    console.error('Review update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Update product rating
    await updateProductRating(productId);

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Review deletion error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful/unhelpful
// @access  Private
router.post('/:id/helpful', authMiddleware, async (req, res) => {
  try {
    const { isHelpful } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Remove existing helpful vote from this user
    review.helpful = review.helpful.filter(
      h => h.user.toString() !== req.user.id
    );

    // Add new vote
    review.helpful.push({
      user: req.user.id,
      isHelpful
    });

    await review.save();

    res.json({ success: true, message: 'Vote recorded successfully' });
  } catch (error) {
    console.error('Helpful vote error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to update product rating
async function updateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
      'ratings.count': stats[0].totalReviews
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      'ratings.average': 0,
      'ratings.count': 0
    });
  }
}

module.exports = router;
