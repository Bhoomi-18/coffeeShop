const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// @route   POST /api/admin/fix-database
// @desc    Fix googleId index issue (TEMPORARY ENDPOINT)
// @access  Public (remove after use)
router.post('/fix-database', async (req, res) => {
  try {
    console.log('🔧 Admin: Fixing database googleId index...');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check current users with null googleId
    const nullGoogleIdUsers = await usersCollection.find({ googleId: null }).toArray();
    console.log(`Found ${nullGoogleIdUsers.length} users with null googleId`);
    
    if (nullGoogleIdUsers.length > 0) {
      // Remove googleId field from email users
      const result = await usersCollection.updateMany(
        { googleId: null },
        { $unset: { googleId: "" } }
      );
      console.log(`Updated ${result.modifiedCount} users`);
    }
    
    // Drop and recreate the googleId index
    try {
      await usersCollection.dropIndex('googleId_1');
      console.log('Dropped existing googleId index');
    } catch (error) {
      console.log('Index may not exist:', error.message);
    }
    
    // Create new sparse index
    await usersCollection.createIndex(
      { googleId: 1 }, 
      { 
        unique: true, 
        sparse: true,
        name: 'googleId_1' 
      }
    );
    
    console.log('✅ Database fix completed successfully!');
    
    res.json({
      success: true,
      message: 'Database googleId index fixed successfully',
      usersUpdated: nullGoogleIdUsers.length
    });
    
  } catch (error) {
    console.error('❌ Database fix error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix database',
      error: error.message
    });
  }
});

module.exports = router;
