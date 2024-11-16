import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bookingform.css";

const stripePromise = loadStripe("pk_test_51QLT1nEoMppwEzq5oA0znkEB41YaZyJX24of8UslKOxDQTVWaLhgXIJjfvcpGDIhzFAVAldcdtiOAjeJjVRU9Fn200eOw191aq");

const BookingForm = () => {
  const location = useLocation();
  const hotelName = location.state?.hotelName || "Default Hotel Name";
  const hotelAddress = location.state?.hotelAddress || "Default Hotel Address";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    numGuests: "",
    roomType: "",
    specialRequests: "",
    rate: 0,
    paymentMethod: "payAtHotel",
  });

  const [error, setError] = useState("");
  const [roomRates] = useState({ Standard: 100, Deluxe: 150, Suite: 200 });
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
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
    const calculateRate = () => {
      if (formData.roomType && formData.numGuests) {
        const divisor = formData.roomType === "Standard" ? 2 : formData.roomType === "Deluxe" ? 3 : 5;
        const rate = Math.ceil(formData.numGuests / divisor) * roomRates[formData.roomType];
        setFormData((prevData) => ({ ...prevData, rate }));
      }
    };

    calculateRate();
  }, [formData.roomType, formData.numGuests, roomRates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to log in to book a room.");
      return;
    }

    const bookingDetails = {
      ...formData,
      hotelName,
      hotelAddress,
    };

    try {
      if (formData.paymentMethod === "payOnline") {
        if (!stripe || !elements) {
          setError("Stripe.js has not loaded yet.");
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setError("Card element is missing.");
          return;
        }

        const { token: stripeToken, error: stripeError } = await stripe.createToken(cardElement);
        if (stripeError) {
          setError(stripeError.message);
          return;
        }

        bookingDetails.stripeToken = stripeToken;
      }

      const response = await fetch("https://hotel-backend-1-8plr.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save booking");
      }

      const data = await response.json();
      alert(`Booking confirmed! Total rate: $${data.rate}`);

      const blob = new Blob([JSON.stringify(bookingDetails, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "booking-details.json";
      link.click();
      URL.revokeObjectURL(url);

      setFormData({
        name: "",
        email: "",
        phone: "",
        checkInDate: "",
        checkOutDate: "",
        numGuests: "",
        roomType: "",
        specialRequests: "",
        rate: 0,
        paymentMethod: "payAtHotel",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <div className="container mt-5 bookingform-container">
        <h2 className="text-center bookingform-title">{hotelName}</h2>
        <p className="text-center bookingform-address">{hotelAddress}</p>
        {error && <p className="text-danger bookingform-error">{error}</p>}
        <form onSubmit={handleSubmit} className="p-4 shadow bookingform-form">
          <input type="text" className="form-control mb-3" name="name" value={formData.name} readOnly placeholder="Your Name" />
          <input type="email" className="form-control mb-3" name="email" value={formData.email} readOnly placeholder="Your Email" />
          <input type="tel" className="form-control mb-3" name="phone" value={formData.phone} readOnly placeholder="Your Phone" />
          <div className="mb-3">
            <label>Check-In Date:</label>
            <input type="date" className="form-control" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Check-Out Date:</label>
            <input type="date" className="form-control" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />
          </div>
          <input type="number" className="form-control mb-3" name="numGuests" value={formData.numGuests} onChange={handleChange} placeholder="Number of Guests" required />
          <select className="form-select mb-3" name="roomType" value={formData.roomType} onChange={handleChange} required>
            <option value="">Select Room Type</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
          <textarea className="form-control mb-3" name="specialRequests" value={formData.specialRequests} onChange={handleChange} placeholder="Special Requests"></textarea>
          <p className="mb-3">Total Rate: ${formData.rate}</p>
          <select className="form-select mb-3" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
            <option value="payAtHotel">Pay at Hotel</option>
            <option value="payOnline">Pay Online</option>
          </select>
          {formData.paymentMethod === "payOnline" && (
            <div className="mb-3">
              <label>Card Details:</label>
              <CardElement className="form-control" />
            </div>
          )}
          <button type="submit" className="btn btn-primary">Book Now</button>
        </form>
      </div>
    </Elements>
  );
};

export default BookingForm;
