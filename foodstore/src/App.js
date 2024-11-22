import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Cart, { addToCart } from './components/Cart';
import Wishlist, { addToWishlist } from './components/Wishlist';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home route showing all products */}
        <Route
          path="/"
          element={<ProductList addToWishlist={addToWishlist} addToCart={addToCart} />}
        />
        {/* Product details route */}
        <Route
          path="/product/:id"
          element={<ProductDetails addToWishlist={addToWishlist} addToCart={addToCart} />}
        />
        {/* Cart and Wishlist routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        {/* Authentication-related routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Profile route */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
