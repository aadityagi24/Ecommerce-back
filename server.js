const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 
const authRoute = require('./routes/authRoute.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const productRoutes = require('./routes/productRoutes')
const cors = require('cors');

// config env
dotenv.config();

// database config
connectDB();

// rest object
const app = express();

// middleware to parse JSON
app.use(express.json());

// Enhanced CORS configuration
const allowedOrigins = [
  "https://ecommerce-front-4fy5mp3qj-aadis-projects-d8feca22.vercel.app",
  "https://ecommerce-front-three-sigma.vercel.app" // Add your other frontend URL here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

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
