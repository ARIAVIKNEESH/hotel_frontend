import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import './mybookings.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        const response = await fetch("https://hotel-backend-1-8plr.onrender.com/api/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const downloadBookingPDF = (booking) => {
    const pdf = new jsPDF();
    pdf.text("Booking Details", 10, 10);
    pdf.text(`Hotel: ${booking.hotelName}`, 10, 20);
    pdf.text(`Address: ${booking.hotelAddress}`, 10, 30);
    pdf.text(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`, 10, 40);
    pdf.text(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`, 10, 50);
    pdf.text(`Guests: ${booking.numGuests}`, 10, 60);
    pdf.text(`Room Type: ${booking.roomType}`, 10, 70);
    pdf.text(`Special Requests: ${booking.specialRequests}`, 10, 80);
    pdf.text(`Rate: ${booking.rate}`, 10, 90);
    pdf.save(`${booking.hotelName}_Booking.pdf`);
  };

  const downloadBookingWord = async (booking) => {
    const doc = new Document();
    doc.addSection({
      children: [
        new Paragraph({ children: [new TextRun({ text: "Booking Details", bold: true, size: 24 })] }),
        new Paragraph(new TextRun(`Hotel: ${booking.hotelName}`)),
        new Paragraph(new TextRun(`Address: ${booking.hotelAddress}`)),
        new Paragraph(new TextRun(`Check-In: ${new Date(booking.checkInDate).toLocaleDateString()}`)),
        new Paragraph(new TextRun(`Check-Out: ${new Date(booking.checkOutDate).toLocaleDateString()}`)),
        new Paragraph(new TextRun(`Guests: ${booking.numGuests}`)),
        new Paragraph(new TextRun(`Room Type: ${booking.roomType}`)),
        new Paragraph(new TextRun(`Special Requests: ${booking.specialRequests}`)),
        new Paragraph(new TextRun(`Rate: ${booking.rate}`)),
      ]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${booking.hotelName}_Booking.docx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center mybookings-loading my-4">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mybookings-error my-4">Error: {error}</div>;
  }

  return (
    <div className="container mybookings-container mt-5 pt-5">
      <h2 className="text-center mybookings-title mb-4">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center mybookings-no-bookings">You have no bookings yet.</p>
      ) : (
        <div className="row">
          {bookings.map((booking, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card mybookings-card">
                <div className="card-body">
                  <h5 className="card-title mybookings-card-title">{booking.hotelName}</h5>
                  <p className="card-text mybookings-card-text"><strong>Hotel Address:</strong> {booking.hotelAddress}</p>
                  <p className="card-text mybookings-card-text"><strong>Check-In:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p className="card-text mybookings-card-text"><strong>Check-Out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  <p className="card-text mybookings-card-text"><strong>Guests:</strong> {booking.numGuests}</p>
                  <p className="card-text mybookings-card-text"><strong>Room Type:</strong> {booking.roomType}</p>
                  <p className="card-text mybookings-card-text"><strong>Special Requests:</strong> {booking.specialRequests}</p>
                  <p className="card-text mybookings-card-text"><strong>Rate:</strong> {booking.rate}</p>
                  <div className="d-flex justify-content-between mt-3">
                    <button className="button" onClick={() => downloadBookingPDF(booking)}>Download as PDF</button>
                    <button className="compare-button" onClick={() => downloadBookingWord(booking)}>Download as Word</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
