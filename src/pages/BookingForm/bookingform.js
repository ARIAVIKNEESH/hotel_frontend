import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bookingform.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QLT1nEoMppwEzq5oA0znkEB41YaZyJX24of8UslKOxDQTVWaLhgXIJjfvcpGDIhzFAVAldcdtiOAjeJjVRU9Fn200eOw191aq');

const BookingForm = () => {
  const location = useLocation();
  const hotelName = location.state?.hotelName || '';
  const hotelAddress = location.state?.hotelAddress || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numGuests: '',
    roomType: '',
    specialRequests: '',
    rate: 0,
    paymentMethod: 'payAtHotel', // Default payment method
  });

  const [error, setError] = useState('');
  const [roomRates, setRoomRates] = useState({ Standard: 100, Deluxe: 150, Suite: 200 });

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setFormData((prevData) => ({
        ...prevData,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      }));
    }
  }, []);

  useEffect(() => {
    if (formData.roomType && formData.numGuests) {
      calculateRate();
    }
  }, [formData.roomType, formData.numGuests]);

  const calculateRate = () => {
    const divisor = formData.roomType === 'Standard' ? 2 : formData.roomType === 'Deluxe' ? 3 : 5;
    const rate = Math.ceil(formData.numGuests / divisor) * roomRates[formData.roomType];
    setFormData((prevData) => ({ ...prevData, rate }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You need to log in to book a room.');
      return;
    }

    if (formData.paymentMethod === 'payOnline') {
      if (!stripe || !elements) {
        setError('Stripe.js has not loaded yet.');
        return;
      }

      // Get the CardElement input details
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setError('Card element is missing.');
        return;
      }

      // Create a payment method with the CardElement
      const { token: stripeToken, error: stripeError } = await stripe.createToken(cardElement);

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      const bookingDetails = {
        ...formData,
        hotelName,
        hotelAddress,
        stripeToken,
      };

      try {
        const response = await fetch('https://hotel-backend-1-8plr.onrender.com/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingDetails),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save booking');
        }

        const data = await response.json();
        alert(`Booking confirmed! Total rate: $${data.rate}`);

        // Download booking details as JSON file
        const blob = new Blob([JSON.stringify(bookingDetails, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'booking-details.json';
        link.click();
        URL.revokeObjectURL(url);

        // Reset form data after successful booking
        setFormData({
          name: '',
          email: '',
          phone: '',
          checkInDate: '',
          checkOutDate: '',
          numGuests: '',
          roomType: '',
          specialRequests: '',
          rate: 0,
          paymentMethod: 'payAtHotel', // Reset payment method
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      const bookingDetails = {
        ...formData,
        hotelName,
        hotelAddress,
        paymentMethod: formData.paymentMethod,
      };

      try {
        const response = await fetch('https://hotel-backend-1-8plr.onrender.com/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingDetails),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save booking');
        }

        const data = await response.json();
        alert(`Booking confirmed! Total rate: $${data.rate}`);

        const blob = new Blob([JSON.stringify(bookingDetails, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'booking-details.json';
        link.click();
        URL.revokeObjectURL(url);

        setFormData({
          name: '',
          email: '',
          phone: '',
          checkInDate: '',
          checkOutDate: '',
          numGuests: '',
          roomType: '',
          specialRequests: '',
          rate: 0,
          paymentMethod: 'payAtHotel', 
        });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container mt-5 bookingform-container">
        <h2 className="mb-3 text-center bookingform-title">{hotelName}</h2>
        <p className="text-center mb-4 bookingform-address">{hotelAddress}</p>
        {error && <p className="text-danger text-center bookingform-error">{error}</p>}
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow bg-white bookingform-form">
          <div className="mb-3">
            <input
              type="text"
              className="form-control bookingform-input"
              name="name"
              value={formData.name}
              placeholder="Your Name"
              readOnly
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control bookingform-input"
              name="email"
              value={formData.email}
              placeholder="Your Email"
              readOnly
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-control bookingform-input"
              name="phone"
              value={formData.phone}
              placeholder="Your Phone Number"
              readOnly
            />
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label bookingform-label">Check-In Date:</label>
              <input
                type="date"
                className="form-control bookingform-input"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label bookingform-label">Check-Out Date:</label>
              <input
                type="date"
                className="form-control bookingform-input"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control bookingform-input"
              name="numGuests"
              value={formData.numGuests}
              onChange={handleChange}
              placeholder="Number of Guests"
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select bookingform-select"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
          <div className="mb-3">
            <textarea
              className="form-control bookingform-textarea"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Special Requests (optional)"
            />
          </div>
          <div className="mb-3">
            <h4 className="text-center bookingform-rate">
              Total Rate: ${formData.rate.toFixed(2)}
            </h4>
          </div>
          <div className="form-group mb-3">
            <label className="form-check-label bookingform-label">
              <input
                type="radio"
                name="paymentMethod"
                value="payAtHotel"
                checked={formData.paymentMethod === 'payAtHotel'}
                onChange={handleChange}
                className="bookingform-radio"
              />
              Pay at Hotel
            </label>
            <br />
            <label className="form-check-label bookingform-label">
              <input
                type="radio"
                name="paymentMethod"
                value="payOnline"
                checked={formData.paymentMethod === 'payOnline'}
                onChange={handleChange}
                className="bookingform-radio"
              />
              Pay Online
            </label>
          </div>
          {formData.paymentMethod === 'payOnline' && (
            <div className="mb-3">
              <CardElement className="form-control bookingform-card" />
            </div>
          )}
          <div className="text-center">
            <button type="submit" className="btn btn-primary bookingform-btn">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </Elements>
  );
};

export default BookingForm;
