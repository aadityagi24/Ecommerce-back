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
app.use(express.json()); // for reading req.body in POST requests
app.use(cors());

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
