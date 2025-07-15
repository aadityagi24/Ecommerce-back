const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 

// Route Imports
const authRoute = require('./routes/authRoute');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

// Initialize .env
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// CORS Configuration
const FRONTEND_URL = "https://ecommerce-front-five-gamma.vercel.app";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

// Optional: Handle preflight requests
app.options("*", cors());

// Optional: Extra CORS headers manually (safe fallback)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Body parser
app.use(express.json());

// Mount routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Root route
app.get('/', (req, res) => {
  res.send(" Backend is live — QuickCart API");
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
