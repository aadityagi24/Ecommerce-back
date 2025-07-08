const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose'); // Make sure mongoose is imported
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

// middleware
app.use(morgan('dev')); // Log requests to console
app.use(express.json());

// Enhanced CORS configuration
const allowedOrigins = [
  "https://ecommerce-front-three-sigma.vercel.app",
  "https://ecommerce-front-4fy5mp3qj-aadis-projects-d8feca22.vercel.app",
  "http://localhost:3000" // For local development
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin && process.env.NODE_ENV !== 'production') return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    status: 'API is working',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send("Welcome to my e-commerce API");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// port
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
