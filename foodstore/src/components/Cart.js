import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import { BACKEND_API_URL } from './Temp';


export const addToCart = async (product) => {
  try {
    const token = localStorage.getItem('token'); 
    const config = {
      headers: { Authorization: `Bearer ${token}` }, 
    };
    await axios.post(
      `${BACKEND_API_URL}/cart`,
      {
        productId: product._id,
        quantity: 1,
      },
      config
    );
    console.log("Product added to cart successfully");
  } catch (error) {
    console.error("Error adding to cart:", error.response?.data?.message || error.message);
  }
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: { Authorization: `Bearer ${token}` }, 
      };
      const response = await axios.get(`${BACKEND_API_URL}/cart`, config);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error.response?.data?.message || error.message);
    }
  };

  const updateCart = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: { Authorization: `Bearer ${token}` }, 
      };
      const response = await axios.put(
        `${BACKEND_API_URL}/cart/${itemId}`,
        { quantity: newQuantity },
        config
      );
      setCartItems((prevCartItems) =>
        prevCartItems.map((item) =>
          item._id === itemId
            ? { ...item, quantity: newQuantity, totalPrice: response.data.totalPrice }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error.response?.data?.message || error.message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: { Authorization: `Bearer ${token}` }, 
      };
      await axios.delete(`${BACKEND_API_URL}/cart/${itemId}`, config);
      fetchCart(); 
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data?.message || error.message);
    }
  };

  const moveToWishlist = async (cartItem) => {
    try {
      const token = localStorage.getItem('token'); 
      const config = {
        headers: { Authorization: `Bearer ${token}` }, 
      };
      await axios.post(
        `${BACKEND_API_URL}/wishlist`,
        { productId: cartItem.product._id },
        config
      );
      await removeFromCart(cartItem._id);
    } catch (error) {
      console.error("Error moving item to wishlist:", error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 1) {
      updateCart(item._id, newQuantity);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                className="product-image"
                src={item.product?.image}
                alt={item.product?.name}
              />
              <h3>{item.product?.name}</h3>
              <p>Price: ${item.product?.price}</p>
              <p>
                Quantity:
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    handleQuantityChange(item, parseInt(e.target.value, 10))
                  }
                  style={{ width: "50px", textAlign: "center", margin: "0 5px" }}
                />
              </p>
              <button onClick={() => moveToWishlist(item)}>Move to Wishlist</button>
              <button onClick={() => removeFromCart(item._id)}>Remove from Cart</button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total Price: ${calculateTotalPrice()}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
