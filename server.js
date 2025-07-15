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

// ✅ CORS setup
app.use(cors({
  origin: "https://ecommerce-front-five-gamma.vercel.app",
  credentials: true,
}));
app.options("*", cors()); // handle preflight

// ✅ Set headers manually (just to be safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ecommerce-front-five-gamma.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// middleware to parse JSON
app.use(express.json());

// routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// rest api
app.get('/', (req, res) => {
  res.send("Welcome to my new website");
});

// port
const PORT = process.env.PORT || 8080;

// run listen
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
