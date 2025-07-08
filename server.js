const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const authRoute = require('./routes/authRoute.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const morgan = require('morgan'); // Added for request logging

// config env
dotenv.config();

// database config
connectDB();

// rest object
const app = express();

// Middlewares
app.use(morgan('dev')); // Request logging
app.use(express.json()); // Parse JSON bodies

// CORS Configuration
app.use(cors({
  origin: "https://ecommerce-front-three-sigma.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to my new website");
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
