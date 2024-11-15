import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './comparehotels.css';

const CompareHotels = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId } = location.state || {};

  const [currentHotel, setCurrentHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const currentResponse = await fetch(`https://hotel-backend-1-8plr.onrender.com/api/hotels/${hotelId}`);
        if (!currentResponse.ok) throw new Error('Failed to fetch current hotel details');
        const currentHotelData = await currentResponse.json();
        setCurrentHotel(currentHotelData);

        const response = await fetch('https://hotel-backend-1-8plr.onrender.com/api/hotels');
        if (!response.ok) throw new Error('Failed to fetch hotels');
        const allHotels = await response.json();

        const filteredHotels = allHotels.filter((hotel) => hotel._id !== hotelId);
        setHotels(filteredHotels);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchHotels();
  }, [hotelId]);

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleBookNow = (hotel) => {
    navigate('/bookingform', { state: { hotelName: hotel.name, hotelAddress: hotel.address } });
  };

  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!currentHotel || hotels.length === 0) return <div className="loading text-center">Loading...</div>;

  return (
    <div className="compare-hotels-container container my-5 py-4">
      <h2 className="text-center mb-4">Compare Hotels</h2>

      <div className="row">
        <div className="col-md-4">
          <div className="card p-4 mb-4 shadow-sm rounded-4">
            <h4 className="mb-3">Available Hotels ({hotels.length})</h4>
            <p>Select a hotel to compare:</p>
            <ul className="list-group list-group-flush">
              {hotels.map((hotel) => (
                <li
                  key={hotel._id}
                  className="list-group-item d-flex align-items-center p-2 rounded-3 mb-2 hotel-item"
                  onClick={() => handleSelectHotel(hotel)}
                >
                  <img src={hotel.images[0]} alt={hotel.name} className="hotel-thumbnail me-3" />
                  <div>
                    <h5 className="mb-1">{hotel.name}</h5>
                    <p className="small mb-0">Rating: {hotel.rating}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selectedHotel && (
          <div className="col-md-8">
            <div className="comparison-section card p-4 shadow-sm rounded-4">
              <h3 className="mb-4">Comparison: {currentHotel.name} vs {selectedHotel.name}</h3>

              <table className="table table-hover mb-4">
                <thead className="table-light">
                  <tr>
                    <th>Feature</th>
                    <th>{currentHotel.name}</th>
                    <th>{selectedHotel.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Rating</td>
                    <td>{currentHotel.rating}</td>
                    <td>{selectedHotel.rating}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td>{currentHotel.address}</td>
                    <td>{selectedHotel.address}</td>
                  </tr>
                  <tr>
                    <td>Room Types & Rates</td>
                    <td>
                      {currentHotel.roomTypes.map((room, index) => (
                        <div key={index}>
                          {room.type}: ${room.rate}
                        </div>
                      ))}
                    </td>
                    <td>
                      {selectedHotel.roomTypes.map((room, index) => (
                        <div key={index}>
                          {room.type}: ${room.rate}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td>Availability</td>
                    <td>{currentHotel.roomTypes.some((room) => room.availability) ? 'Available' : 'Not Available'}</td>
                    <td>{selectedHotel.roomTypes.some((room) => room.availability) ? 'Available' : 'Not Available'}</td>
                  </tr>
                </tbody>
              </table>

              <div className="row mt-3">
                <div className="col">
                  <h5>{currentHotel.name} Images</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {currentHotel.images.map((img, index) => (
                      <img key={index} src={img} alt={`${currentHotel.name} - ${index + 1}`} className="hotel-image" />
                    ))}
                  </div>
                  <button onClick={() => handleBookNow(currentHotel)} className="compare-button">
                    Book Now
                  </button>
                </div>

                <div className="col">
                  <h5>{selectedHotel.name} Images</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {selectedHotel.images.map((img, index) => (
                      <img key={index} src={img} alt={`${selectedHotel.name} - ${index + 1}`} className="hotel-image" />
                    ))}
                  </div>
                  <button onClick={() => handleBookNow(selectedHotel)} className="button">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareHotels;
