import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';
import { BACKEND_API_URL } from './Temp';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    console.log("Backend URL: ", BACKEND_API_URL);
    axios
      .get(`${BACKEND_API_URL}/products`) 
      .then((response) => {
        setProducts(response.data); 
        console.log("Fetched products:", response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  
  if (loading) {
    return <p>Loading products...</p>;
  }

  
  if (error) {
    return <p>{error}</p>;
  }

  
  return (
    <div className="product-container">
      {products.map((product) => (
        <div className="product-card" key={product._id}>
          <img className="product-image" src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="product-price">${product.price}</p>
          <Link
            className="view-details-link"
            to={`/product/${product._id}`} 
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
