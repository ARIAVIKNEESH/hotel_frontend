import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/navbar';
import Home from './pages/Home/home';
import Rooms from './pages/Rooms/rooms';
import About from './pages/About/about';
import Reviews from './pages/Reviews/reviews';
import Login from './components/Login/login';
import Signup from './components/Signup/signup';
import RoomDetails from './pages/Roomdetails/roomdetails';
import BookingForm from './pages/BookingForm/bookingform';
import CompareHotels from './pages/CompareHotels/comparehotels';
import MyBookings from './pages/MyBookings/mybookings';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QLT1nEoMppwEzq5oA0znkEB41YaZyJX24of8UslKOxDQTVWaLhgXIJjfvcpGDIhzFAVAldcdtiOAjeJjVRU9Fn200eOw191aq');

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/'; 
  };
=
  const token = localStorage.getItem('token');

  return (
    <Router>
      {token && <Navbar onLogout={handleLogout} />}
      <Routes>
        {!token ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/comparehotels" element={<CompareHotels />} />
            <Route path="/room/:id" element={<RoomDetails />} />
            <Route 
              path="/bookingform" 
              element={
                <Elements stripe={stripePromise}>
                  <BookingForm />
                </Elements>
              } 
            />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
