# MsCafe Backend API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/google
Authenticate with Google credential.
```json
{
  "credential": "google-id-token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "avatar-url",
    "loyaltyPoints": 100,
    "preferences": {}
  }
}
```

#### GET /api/auth/user
Get current authenticated user information.

#### POST /api/auth/logout
Logout current user.

#### PUT /api/auth/preferences
Update user preferences.

### Product Routes (`/api/products`)

#### GET /api/products
Get all products with filtering and pagination.

**Query Parameters:**
- `category` - Filter by category (coffee, tea, pastry, sandwich, dessert, beverage)
- `featured` - Filter featured products (true/false)
- `available` - Filter available products (true/false)
- `search` - Search in name and description
- `sortBy` - Sort field (name, price, ratings.average)
- `sortOrder` - Sort order (asc/desc)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```
GET /api/products?category=coffee&featured=true&page=1&limit=10
```

#### GET /api/products/categories
Get all available product categories.

#### GET /api/products/featured
Get featured products (max 6).

#### GET /api/products/:id
Get single product by ID.

#### POST /api/products
Create new product (Admin only).

#### PUT /api/products/:id
Update product (Admin only).

#### DELETE /api/products/:id
Delete product (Admin only).

### Order Routes (`/api/orders`)

#### POST /api/orders
Create new order.

**Request Body:**
```json
{
  "items": [
    {
      "product": "product-id",
      "quantity": 2,
      "customizations": [
        {
          "type": "size",
          "option": "Large",
          "priceModifier": 1.50
        }
      ]
    }
  ],
  "deliveryMethod": "pickup", // pickup, delivery, dine_in
  "paymentMethod": "card", // card, cash, wallet, loyalty_points
  "customerNotes": "Extra hot please",
  "loyaltyPointsUsed": 50
}
```

#### GET /api/orders
Get user's orders with pagination.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by status (pending, confirmed, preparing, ready, completed, cancelled)

#### GET /api/orders/:id
Get single order by ID.

#### PUT /api/orders/:id/status
Update order status (Admin only).

#### POST /api/orders/:id/cancel
Cancel order (only if pending or confirmed).

### Review Routes (`/api/reviews`)

#### POST /api/reviews
Create new review.

**Request Body:**
```json
{
  "productId": "product-id",
  "orderId": "order-id",
  "rating": 5,
  "comment": "Great coffee!"
}
```

#### GET /api/reviews/product/:productId
Get reviews for a product.

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `sortBy` - Sort field (createdAt, rating)
- `sortOrder` - Sort order (asc/desc)

#### PUT /api/reviews/:id
Update review.

#### DELETE /api/reviews/:id
Delete review.

#### POST /api/reviews/:id/helpful
Mark review as helpful/unhelpful.

```json
{
  "isHelpful": true
}
```

## Data Models

### User
```json
{
  "_id": "ObjectId",
  "googleId": "string",
  "name": "string",
  "email": "string",
  "avatar": "string",
  "provider": "google",
  "loyaltyPoints": "number",
  "favoriteOrders": "array",
  "preferences": {
    "newsletter": "boolean",
    "notifications": "boolean",
    "favoriteStore": "string"
  },
  "orderHistory": "array",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Product
```json
{
  "_id": "ObjectId",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "image": "string",
  "ingredients": "array",
  "allergens": "array",
  "nutritionalInfo": {
    "calories": "number",
    "protein": "number",
    "carbs": "number",
    "fat": "number",
    "sugar": "number"
  },
  "customizable": "boolean",
  "customizations": "array",
  "available": "boolean",
  "featured": "boolean",
  "preparationTime": "number",
  "ratings": {
    "average": "number",
    "count": "number"
  },
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Order
```json
{
  "_id": "ObjectId",
  "orderNumber": "string",
  "user": "ObjectId",
  "items": "array",
  "subtotal": "number",
  "tax": "number",
  "tip": "number",
  "discount": {
    "amount": "number",
    "code": "string",
    "reason": "string"
  },
  "total": "number",
  "status": "string",
  "paymentStatus": "string",
  "paymentMethod": "string",
  "deliveryMethod": "string",
  "estimatedTime": "date",
  "actualCompletionTime": "date",
  "customerNotes": "string",
  "loyaltyPointsEarned": "number",
  "loyaltyPointsUsed": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with required variables (see `.env` file).

3. **Seed sample data:**
   ```bash
   npm run seed
   ```

4. **Start the server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

5. **Test the API:**
   Visit `http://localhost:5001/api/health` to check if the server is running.

## Authentication Flow

1. **Frontend Integration:**
   - Use Google Sign-In button to get credential
   - Send credential to `/api/auth/google`
   - Store returned JWT token
   - Include token in subsequent requests

2. **Google OAuth Setup:**
   - Configure Google OAuth in Google Console
   - Add authorized origins: `http://localhost:3000`
   - Add authorized redirect URIs: `http://localhost:5001/api/auth/google/callback`

## Features

- ✅ Google OAuth Authentication
- ✅ JWT Token Management
- ✅ User Management & Profiles
- ✅ Product Catalog with Categories
- ✅ Order Management System
- ✅ Review & Rating System
- ✅ Loyalty Points System
- ✅ Customizable Products
- ✅ Search & Filtering
- ✅ Pagination
- ✅ Error Handling
- ✅ Input Validation
- ✅ Database Indexing

## Security Features

- CORS protection
- Helmet security headers
- JWT authentication
- Input validation
- Error handling
- Session management
