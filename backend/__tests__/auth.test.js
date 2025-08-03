const { test } = require('@jest/globals');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

// Test database connection
beforeAll(async () => {
  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffeeshop_test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication Endpoints', () => {
  test('GET /api/health should return 200', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(res.body.message).toContain('MsCafe API is running');
  });

  test('POST /api/auth/register should validate required fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({})
      .expect(400);
    
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('provide name, email, and password');
  });

  test('POST /api/auth/login should validate credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
      .expect(400);
    
    expect(res.body.success).toBe(false);
  });
});

describe('Protected Routes', () => {
  test('GET /api/auth/user should require authentication', async () => {
    const res = await request(app)
      .get('/api/auth/user')
      .expect(401);
    
    expect(res.body.success).toBe(false);
  });
});
