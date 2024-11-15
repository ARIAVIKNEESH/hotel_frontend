import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    aadhar: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://hotel-backend-1-8plr.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <video className="signup-video-background" autoPlay muted loop>
        <source src="/background.mp4" type="video/mp4" />
      </video>
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="signup-form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <div className="signup-form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <div className="signup-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <div className="signup-form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <div className="signup-form-group">
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <div className="signup-form-group">
            <input
              type="text"
              name="aadhar"
              placeholder="Aadhar Number"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <div className="signup-form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="signup-form-control"
            />
          </div>
          <button type="submit" className="signup-btn">
            Sign Up
          </button>
        </form>
        <p className="signup-footer">
          Already have an account? <a href="/">Login here</a>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
