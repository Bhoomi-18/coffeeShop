const mongoose = require('mongoose');
const Product = require('../models/product');
require('dotenv').config();

const sampleProducts = [
  // Coffee
  {
    name: "Espresso",
    description: "Rich, bold espresso shot made from premium coffee beans",
    price: 2.50,
    category: "coffee",
    image: "/images/espresso.jpg",
    ingredients: ["Espresso beans", "Water"],
    allergens: [],
    nutritionalInfo: {
      calories: 5,
      protein: 0.3,
      carbs: 1,
      fat: 0,
      sugar: 0
    },
    customizable: true,
    customizations: [
      {
        type: "shots",
        options: [
          { name: "Single", priceModifier: 0 },
          { name: "Double", priceModifier: 1.50 },
          { name: "Triple", priceModifier: 3.00 }
        ]
      }
    ],
    available: true,
    featured: true,
    preparationTime: 3
  },
  {
    name: "Cappuccino",
    description: "Classic Italian coffee with steamed milk and foam",
    price: 4.50,
    category: "coffee",
    image: "/images/cappuccino.jpg",
    ingredients: ["Espresso", "Steamed milk", "Milk foam"],
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 120,
      protein: 6,
      carbs: 12,
      fat: 4,
      sugar: 10
    },
    customizable: true,
    customizations: [
      {
        type: "size",
        options: [
          { name: "Small", priceModifier: 0 },
          { name: "Medium", priceModifier: 0.75 },
          { name: "Large", priceModifier: 1.50 }
        ]
      },
      {
        type: "milk",
        options: [
          { name: "Whole milk", priceModifier: 0 },
          { name: "Almond milk", priceModifier: 0.60 },
          { name: "Oat milk", priceModifier: 0.60 },
          { name: "Soy milk", priceModifier: 0.60 }
        ]
      }
    ],
    available: true,
    featured: true,
    preparationTime: 5
  },
  {
    name: "Latte",
    description: "Smooth espresso with steamed milk and light foam",
    price: 5.00,
    category: "coffee",
    image: "/images/latte.jpg",
    ingredients: ["Espresso", "Steamed milk", "Light foam"],
    allergens: ["Dairy"],
    nutritionalInfo: {
      calories: 150,
      protein: 8,
      carbs: 15,
      fat: 6,
      sugar: 14
    },
    customizable: true,
    customizations: [
      {
        type: "size",
        options: [
          { name: "Small", priceModifier: 0 },
          { name: "Medium", priceModifier: 0.75 },
          { name: "Large", priceModifier: 1.50 }
        ]
      },
      {
        type: "syrup",
        options: [
          { name: "None", priceModifier: 0 },
          { name: "Vanilla", priceModifier: 0.50 },
          { name: "Caramel", priceModifier: 0.50 },
          { name: "Hazelnut", priceModifier: 0.50 }
        ]
      }
    ],
    available: true,
    featured: false,
    preparationTime: 4
  },
  // Pastries
  {
    name: "Croissant",
    description: "Buttery, flaky French pastry perfect with coffee",
    price: 3.50,
    category: "pastry",
    image: "/images/croissant.jpg",
    ingredients: ["Flour", "Butter", "Yeast", "Salt", "Sugar"],
    allergens: ["Gluten", "Dairy"],
    nutritionalInfo: {
      calories: 280,
      protein: 6,
      carbs: 28,
      fat: 16,
      sugar: 3
    },
    customizable: false,
    customizations: [],
    available: true,
    featured: false,
    preparationTime: 2
  },
  {
    name: "Blueberry Muffin",
    description: "Fresh baked muffin with juicy blueberries",
    price: 3.75,
    category: "pastry",
    image: "/images/blueberry-muffin.jpg",
    ingredients: ["Flour", "Blueberries", "Sugar", "Eggs", "Butter", "Baking powder"],
    allergens: ["Gluten", "Eggs", "Dairy"],
    nutritionalInfo: {
      calories: 320,
      protein: 5,
      carbs: 45,
      fat: 14,
      sugar: 25
    },
    customizable: false,
    customizations: [],
    available: true,
    featured: true,
    preparationTime: 1
  },
  // Beverages
  {
    name: "Iced Green Tea",
    description: "Refreshing cold-brewed green tea with natural antioxidants",
    price: 3.00,
    category: "beverage",
    image: "/images/iced-green-tea.jpg",
    ingredients: ["Green tea", "Water", "Ice"],
    allergens: [],
    nutritionalInfo: {
      calories: 2,
      protein: 0,
      carbs: 0,
      fat: 0,
      sugar: 0
    },
    customizable: true,
    customizations: [
      {
        type: "sweetener",
        options: [
          { name: "None", priceModifier: 0 },
          { name: "Honey", priceModifier: 0.50 },
          { name: "Agave", priceModifier: 0.50 },
          { name: "Simple syrup", priceModifier: 0.30 }
        ]
      }
    ],
    available: true,
    featured: false,
    preparationTime: 2
  },
  // Sandwiches
  {
    name: "Grilled Chicken Sandwich",
    description: "Tender grilled chicken with fresh vegetables on artisan bread",
    price: 8.50,
    category: "sandwich",
    image: "/images/chicken-sandwich.jpg",
    ingredients: ["Grilled chicken", "Lettuce", "Tomato", "Artisan bread", "Mayo"],
    allergens: ["Gluten"],
    nutritionalInfo: {
      calories: 450,
      protein: 35,
      carbs: 35,
      fat: 18,
      sugar: 5
    },
    customizable: true,
    customizations: [
      {
        type: "bread",
        options: [
          { name: "White", priceModifier: 0 },
          { name: "Whole wheat", priceModifier: 0.50 },
          { name: "Sourdough", priceModifier: 0.75 }
        ]
      }
    ],
    available: true,
    featured: true,
    preparationTime: 8
  },
  // Desserts
  {
    name: "Chocolate Chip Cookie",
    description: "Warm, gooey chocolate chip cookie baked fresh daily",
    price: 2.25,
    category: "dessert",
    image: "/images/chocolate-chip-cookie.jpg",
    ingredients: ["Flour", "Chocolate chips", "Butter", "Sugar", "Eggs"],
    allergens: ["Gluten", "Dairy", "Eggs"],
    nutritionalInfo: {
      calories: 200,
      protein: 3,
      carbs: 28,
      fat: 9,
      sugar: 18
    },
    customizable: false,
    customizations: [],
    available: true,
    featured: false,
    preparationTime: 1
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedProducts();
}

module.exports = { sampleProducts, seedProducts };
