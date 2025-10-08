# 🛍️ CodVeda Islamic & African Fashion Platform

A modern, full-stack e-commerce application specializing in authentic Islamic and African fashion. Built with Node.js, Express, MongoDB, and vanilla JavaScript. Features a professional admin panel for product management and a beautiful customer-facing storefront showcasing premium Islamic and African attire.

## 🚀 Features

### 🎯 Customer Features

- **Modern UI/UX**: Beautiful gradient design with smooth animations
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Product Browsing**: Grid layout with 3 products per line (responsive)
- **Category Filtering**: Filter products by category (Abaya, Hijab, Ankara, Jallabiya, etc.)
- **Product Details**: High-quality images, descriptions, pricing, and stock status
- **Add to Cart**: Interactive cart functionality with notifications
- **Stock Awareness**: Real-time stock status (In Stock, Low Stock, Out of Stock)

### 🔧 Admin Features

- **Complete CRUD Operations**: Create, Read, Update, Delete products
- **User-Friendly Interface**: Professional admin panel with intuitive forms
- **Product Management**: Manage all product details including images, categories, stock
- **Real-time Updates**: Changes reflect immediately in the storefront
- **Image Management**: Support for product images via URLs
- **Category Management**: Organized product categorization
- **Stock Management**: Track and update inventory levels

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript** - Interactive functionality
- **Fetch API** - HTTP requests to backend

### Database

- **MongoDB Atlas** - Cloud database service
- **Collections**: Products with full schema validation

## 📁 Project Structure

```
codveda-ecommerce/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── product.js          # Product schema
│   │   ├── controllers/
│   │   │   └── productController.js # CRUD operations
│   │   ├── routes/
│   │   │   └── products.js          # API routes
│   │   ├── middlewares/
│   │   │   └── errorHandler.js      # Error handling
│   │   ├── app.js                   # Main server file
│   │   └── seed.js                  # Database seeding
│   ├── package.json
│   ├── .env                         # Environment variables (not in repo)
│   └── .env.example                 # Environment template
├── frontend/
│   ├── index.html                   # Customer storefront
│   └── admin.html                   # Admin panel
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/DreadTheMystery/codveda-ecommerce.git
   cd codveda-ecommerce
   ```

2. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy the environment template
   cp .env.example .env

   # Edit .env with your MongoDB connection string
   nano .env
   ```

4. **Configure your .env file**

   ```env
   PORT=4000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/clothing_shop_db?retryWrites=true&w=majority
   ```

5. **Seed the database**

   ```bash
   npm run seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

7. **Open the application**
   - **Storefront**: Open `frontend/index.html` in your browser
   - **Admin Panel**: Open `frontend/admin.html` in your browser
   - **API**: Available at `http://localhost:4000`

## 📚 API Documentation

### Endpoints

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/`                 | Health check       |
| GET    | `/api/products`     | Get all products   |
| GET    | `/api/products/:id` | Get single product |
| POST   | `/api/products`     | Create new product |
| PUT    | `/api/products/:id` | Update product     |
| DELETE | `/api/products/:id` | Delete product     |

### Product Schema

```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  image_url: String,
  category: String,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Example API Usage

**Create a product:**

```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Blue T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "price": 2500,
    "image_url": "https://example.com/image.jpg",
    "category": "T-Shirts",
    "stock": 10
  }'
```

## 🎨 Design Features

### Visual Design

- **Gradient Backgrounds**: Modern purple gradient theme
- **Glass Morphism**: Frosted glass effects on navigation
- **Smooth Animations**: Hover effects and transitions
- **Typography**: Clean, modern font stack
- **Responsive Grid**: 3-column desktop, 2-column tablet, 1-column mobile

### User Experience

- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation for user actions
- **Stock Indicators**: Clear inventory status
- **Category Filtering**: Easy product organization

## 🔒 Security Features

- **Environment Variables**: Sensitive data stored securely
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Proper error responses without exposing internals
- **CORS Configuration**: Controlled cross-origin requests

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, etc.)

1. Set environment variables in your hosting platform
2. Deploy the `backend` folder
3. Update frontend API endpoints to production URL

### Frontend Deployment (Netlify, Vercel, etc.)

1. Deploy the `frontend` folder
2. Update API base URL in JavaScript files
3. Configure CORS on backend for production domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Shopping cart persistence
- [ ] Order management system
- [ ] Payment integration
- [ ] Email notifications
- [ ] Advanced product search
- [ ] Customer reviews and ratings
- [ ] Wishlist functionality
- [ ] Multi-image support per product
- [ ] Inventory alerts

## 👨‍💻 Author

**DreadTheMystery**

- GitHub: [@DreadTheMystery](https://github.com/DreadTheMystery)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Placeholder image service for product images
- Modern web design principles and best practices

---

**⭐ If you find this project helpful, please give it a star!**
