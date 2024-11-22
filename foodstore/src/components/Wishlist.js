import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import { BACKEND_API_URL } from './Temp';


export const fetchWishlistItems = async (setWishlistItems) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(`${BACKEND_API_URL}/wishlist`, config);
    setWishlistItems(response.data);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};


export const addToWishlist = async (product) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios.post(`${BACKEND_API_URL}/wishlist`, { productId: product._id }, config);
    console.log("Product added to wishlist successfully");
  } catch (error) {
    console.error("Error adding to wishlist:", error);
  }
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist items
  const fetchWishlist = () => {
    fetchWishlistItems(setWishlistItems);
  };

  // Move item to cart
  const moveToCart = async (wishlistItem) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        `${BACKEND_API_URL}/cart`,
        { productId: wishlistItem.product._id, quantity: 1 },
        config
      );
      await removeFromWishlist(wishlistItem._id);
    } catch (error) {
      console.error("Error moving item to cart:", error);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.delete(`${BACKEND_API_URL}/wishlist/${id}`, config);
      fetchWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  // Use effect to fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="wishlist">
      <h2>Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map((item) => (
            item.product ? (
              <div key={item._id} className="wishlist-item">
                <img
                  className="product-image"
                  src={item.product.image}
                  alt={item.product.name}
                />
                <h3>{item.product.name}</h3>
                <p>Price: ${item.product.price}</p>
                <button onClick={() => moveToCart(item)}>Move to Cart</button>
                <button onClick={() => removeFromWishlist(item._id)}>
                  Remove from Wishlist
                </button>
              </div>
            ) : (
              <div key={item._id} className="wishlist-item">
                <p>Product data unavailable</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
