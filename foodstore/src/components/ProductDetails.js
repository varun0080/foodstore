import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';
import { BACKEND_API_URL } from './Temp';

const ProductDetails = ({ addToCart, addToWishlist }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // To handle redirection
  const [product, setProduct] = useState(location.state?.product || null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product) {
      axios.get(`${BACKEND_API_URL}/products/${id}`)
        .then(response => {
          setProduct(response.data);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
          setError('Product not found.');
        });
    }
  }, [id, product]);

  const handleAddToCart = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to the cart.');
      navigate('/login'); // Redirect to login page if not logged in
    } else {
      addToCart(product);
    }
  };

  const handleAddToWishlist = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to the wishlist.');
      navigate('/login'); // Redirect to login page if not logged in
    } else {
      addToWishlist(product);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-details">
      <img className="product-image" src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p className="product-description">{product.detailedDescription}</p>
      <p>Price: ${product.price}</p>
      <button className="product-button" onClick={() => handleAddToCart(product)}>Add to Cart</button>
      <button className="product-button" onClick={() => handleAddToWishlist(product)}>Add to Wishlist</button>
    </div>
  );
};

export default ProductDetails;
