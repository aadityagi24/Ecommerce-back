const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const authRoute = require('./routes/authRoute.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

// config env
dotenv.config();

// database config
connectDB();

// rest object
const app = express();

// CORS Configuration
app.use(cors({
  origin: "https://ecommerce-front-three-sigma.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware to parse JSON
app.use(express.json()); 

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to my new website");
});

// Port
const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
