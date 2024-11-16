// src/components/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link to="/home" className="navbar-brand">
          Hotel Booking App
        </Link>
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/home" className="nav-link" onClick={toggleMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/rooms" className="nav-link" onClick={toggleMenu}>Rooms</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={toggleMenu}>About Us</Link>
            </li>
            <li className="nav-item">
              <Link to="/reviews" className="nav-link" onClick={toggleMenu}>Contact & Reviews</Link>
            </li>
            <li className="nav-item">
              <Link to="/my-bookings" className="nav-link" onClick={toggleMenu}>See My Bookings</Link>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger nav-link" onClick={() => { toggleMenu(); onLogout(); }}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
