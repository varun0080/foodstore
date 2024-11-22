import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; 

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    alert('Logged out successfully!');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token'); 

  return (
    <nav className="nav">
      <h1>Food Store</h1>
      <ul className="nav-list">
        <li className="nav-item">
          <Link className="nav-link" to="/">Products</Link>
        </li>
        {isLoggedIn && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/wishlist">Wishlist</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link" onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
        {!isLoggedIn && (
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
