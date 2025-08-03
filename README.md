# ☕ Coffee Shop - Open Source E-commerce Platform

A modern, full-stack coffee shop e-commerce application built with React.js and Node.js.

![Coffee Shop Banner](./public/3817208_coffee_cup_drink_icon.png)

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)


## 🚀 Features

- **User Authentication**: Email/Password and Google OAuth login
- **Product Catalog**: Browse coffee, cakes, milkshakes, and soups  
- **Shopping Cart**: Add/remove items with real-time updates
- **Order Management**: Place and track orders
- **Product Reviews**: Rate and review products
- **Admin Panel**: Manage products, orders, and users
- **Responsive Design**: Mobile-friendly interface
- **Customer Support**: Interactive chatbot

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **Redux Toolkit** - State Management  
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js & Express.js** - Server
- **MongoDB** - Database
- **JWT & Passport.js** - Authentication
- **PM2** - Process Management

## 📦 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mujtabaa07/coffeeShop.git
cd coffeeShop
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create your local environment file
cp .env.example .env
# OR copy from the local example
cp .env.local.example .env

# Edit .env with your actual values (MongoDB URI, JWT secret, Google OAuth, etc.)
nano .env

# Start the backend server
npm start
```

3. **Setup Frontend**
```bash
# In project root directory
npm install

# Create your local environment file
cp .env.example .env.local
# OR copy from the local example  
cp .env.local.example .env.local

# Edit .env.local with your API URL and Google Client ID
nano .env.local

# Start the frontend
npm start
```

4. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3000/api

## ⚙️ Environment Configuration


### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/mscafe_coffeeshop
JWT_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=your-google-client-id  
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=3000
NODE_ENV=development
# Or run separately:
# Backend: cd backend && npm run dev
# Frontend: npm start
```
Once the server is running, you can view the app at (http://localhost:3000).


## Usage
**To use the app:**
- **View Coffee Menu:** Browse through the available coffee items on the homepage.
- **Learn About Coffee:** Check out the sourcing section to learn more about our sustainably sourced beans.
- **Place an Order:** In future releases, you'll be able to add items to the cart and complete orders.

## Known Issues

### 1. Edit Profile Button Not Functional

The **Edit Profile** button on the user profile screen is currently non-functional, clicking or tapping it does not trigger any visible action.

#### Possible Causes
- The button may lack an `onClick` or equivalent event handler
- The navigation route to the Edit Profile screen may be missing or misconfigured
- The Edit Profile screen/component might not be implemented or properly linked

#### Suggested Troubleshooting
- Check if the button has a correctly assigned event handler
- Verify that navigation to the Edit Profile screen is set up and routed properly
- Confirm that the target screen/component exists and is integrated into the navigation system

## ScreenShots
## **Home Page:** 
![homepage](https://github.com/user-attachments/assets/2dc9b51d-ce06-4eb6-89fb-774867ede12c)
## **Coffee Menu:**
![coffeemenu](https://github.com/user-attachments/assets/014c6a7a-03ab-4bdf-88e1-bb3c11d66447)
## **Login Page**
![coffeelogin](https://github.com/user-attachments/assets/c6c7c645-475d-4658-a47c-f0ada0b177d1)
## **Testimonials**
![testimonials](https://github.com/user-attachments/assets/38d811e3-4acc-4901-9a3d-8e4185c96a2c)

## Contributing
We welcome contributions! Follow the steps below to contribute to this project:
```bash
# Click the "Fork" button at the top-right of the repository page to create a copy in your GitHub account.
```

### Frontend (.env.local)
Create a `.env.local` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

**Note**: Your local `.env` files are ignored by Git for security. Use the provided `.env.example` files as templates.

## 🌐 Live Demo

- **Frontend**: [https://coffee-shop-teal.vercel.app](https://coffee-shop-teal.vercel.app)
- **API**: Contact for backend access

## 📱 Screenshots

*Coming soon - Add your screenshots here*

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`) 
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mujtabaa07** - [GitHub](https://github.com/Mujtabaa07)

## ⭐ Support

If you find this project helpful, please give it a star! ⭐

---

Made with ❤️ and lots of ☕
