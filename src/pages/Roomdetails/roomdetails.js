import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './roomdetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [userName] = useState(localStorage.getItem('userName'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`https://hotel-backend-1-8plr.onrender.com/api/hotels/${id}`);
        if (!response.ok) throw new Error('Failed to fetch hotel details');
        const data = await response.json();
        setHotel(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchHotelDetails();
  }, [id]);

  const handleAddReview = async () => {
    if (!reviewText) return;
    try {
      const response = await fetch(`https://hotel-backend-1-8plr.onrender.com/api/hotels/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: reviewText, reviewer: userName, rating: 4 }),
      });
      const data = await response.json();
      if (response.ok) {
        setHotel((prevHotel) => ({
          ...prevHotel,
          reviews: [...prevHotel.reviews, data.review],
        }));
        setReviewText('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 2000);
      } else {
        alert(data.message || 'Failed to add review');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleBookNow = () => {
    navigate('/bookingform', { state: { hotelName: hotel.name, hotelAddress: hotel.address } });
  };

  const handleCompareNow = () => {
    navigate('/comparehotels', { state: { hotelId: id } });
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!hotel) return <div className="loading-message">Loading...</div>;

  return (
    <div className="container my-5 room-details-page">
      <div className="text-center mb-4">
        <h1 className="display-4">{hotel.name}</h1>
        <p className="text-muted">{hotel.address}</p>
        <span className="badge bg-success fs-6 mb-3">Rating: {hotel.rating}</span>
      </div>

      {/* Images Section */}
      <div className="row image-gallery mb-5">
        {hotel.images.map((image, index) => (
          <div key={index} className="col-md-4 col-sm-6 mb-4">
            <div className="image-card">
              <img src={image} className="img-fluid rounded" alt={`${hotel.name} - ${index + 1}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Room Types</h3>
          <ul className="list-group list-group-flush">
            {hotel.roomTypes.map((room, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{room.type}</span>
                <span className={`badge ${room.availability ? 'bg-primary' : 'bg-secondary'}`}>
                  ${room.rate} {room.availability ? '(Available)' : '(Not Available)'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Reviews</h3>
          <ul className="list-group list-group-flush mb-3">
            {hotel.reviews.map((review, index) => (
              <li key={index} className="list-group-item">
                <strong>{review.reviewer}:</strong> {review.comment} (Rating: {review.rating})
              </li>
            ))}
          </ul>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here"
            className="form-control mb-2"
            rows="3"
          />
          <button onClick={handleAddReview} className="review-button">Add Review</button>
          {reviewSuccess && <div className="alert alert-success mt-2">Review added ✔</div>}
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3">
        <button onClick={handleBookNow} className="book-button">Book Now</button>
        <button onClick={handleCompareNow} className="compare-button">Compare Now</button>
      </div>
    </div>
  );
};

export default RoomDetails;
