import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './rooms.css';

const Rooms = () => {
  const [hotels, setHotels] = useState([]);
  const [filter, setFilter] = useState({ address: '', rate: '', roomType: '' });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('https://hotel-backend-1-8plr.onrender.com/api/hotels');
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filteredHotels = hotels.filter(hotel => {
    return (
      (!filter.address || hotel.address.toLowerCase().includes(filter.address.toLowerCase())) &&
      (!filter.rate || hotel.roomTypes.some(room => room.rate <= filter.rate)) &&
      (!filter.roomType || hotel.roomTypes.some(room => room.type.toLowerCase() === filter.roomType.toLowerCase()))
    );
  });

  return (
    <div className="container my-5 rooms-container">
      <h1 className="text-center mb-4 display-4">Explore Our Hotels</h1>

      {/* Filter Section */}
      <div className="rooms-filters row mb-4 p-3 bg-light rounded shadow-sm">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            name="address"
            className="form-control form-control-lg"
            placeholder="Filter by address"
            value={filter.address}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="number"
            name="rate"
            className="form-control form-control-lg"
            placeholder="Max rate"
            value={filter.rate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <input
            type="text"
            name="roomType"
            className="form-control form-control-lg"
            placeholder="Filter by room type"
            value={filter.roomType}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Hotels Display Section */}
      <div className="row">
        {filteredHotels.map(hotel => (
          <div key={hotel._id} className="col-md-4 mb-4">
            <div className="card hotel-card shadow-lg border-0">
              <div className="position-relative">
                <img src={hotel.images[0]} className="card-img-top hotel-image" alt={hotel.name} />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-3 text-white overlay-bg">
                  <h5 className="card-title mb-1">{hotel.name}</h5>
                  <p className="card-text mb-2">Rating: <strong>{hotel.rating}</strong></p>
                  <Link to={`/room/${hotel._id}`} className="btn btn-outline-light btn-sm">
                    View More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
