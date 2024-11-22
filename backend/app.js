const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config(); 

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products'); 
const cartRouter = require('./routes/cart');
const wishlistRouter = require('./routes/wishlist');
const profileRouter = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(cors({ origin: 'http://YOUR_FRONTEND_DOMAIN' }));
app.use(express.static(path.join(__dirname, './../foodstore/build')));

app.use('/', indexRouter);
app.use('/api', usersRouter); // Updated line to use /api as the base for usersRouter
app.use('/api/products', productsRouter); 
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/profile', profileRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieParser());

const port = process.env.PORT || 5000;

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './../foodstore/build', 'index.html'));
});

module.exports = app;
