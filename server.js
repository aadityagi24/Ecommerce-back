const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const authRoute = require('./routes/authRoute.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const cors = require('cors');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// ======= MIDDLEWARES =======

// Logging
app.use(morgan('dev'));

// Parse incoming JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: "https://ecommerce-front-three-sigma.vercel.app", // Your live frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight OPTIONS requests

// ======= ROUTES =======

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to my new website");
});

// ======= ERROR HANDLING =======

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Server Error
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ======= START SERVER =======

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
