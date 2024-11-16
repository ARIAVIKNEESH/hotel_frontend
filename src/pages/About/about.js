import React from 'react';
import './about.css';

const About = () => (
  <div className="about-container">
    <header className="about-header">
      <div className="header-content">
        <h1>Discover Your Next Adventure</h1>
        <p>Welcome to [Your Hotel Booking App], your gateway to premium stays, luxurious experiences, and the world’s best destinations.</p>
      </div>
    </header>

    <section className="about-intro">
      <div className="intro-text">
        <h2>Your Ultimate Hotel Booking Platform</h2>
        <p>Our platform offers unparalleled hotel booking services that are designed to make your travel experience seamless, from beginning to end. Explore our vast selection of hotels, all at competitive prices and with top-notch customer support.</p>
      </div>
      <div className="intro-image">
        <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/de/e6/44/the-pool-at-the-linq.jpg?w=700&h=-1&s=1" alt="Hotel Experience" />
      </div>
    </section>

    <section className="about-services">
      <h3>Why Book With Us?</h3>
      <div className="services-grid">
        <div className="service-item">
          <img src="https://m.bbb.org/prod/corecmsimages/03e136d8-c7c8-4fd8-be3e-876d90d00b58.jpg" alt="Easy Booking" />
          <h4>Easy Booking</h4>
          <p>With our user-friendly interface, booking your stay is just a few clicks away.</p>
        </div>
        <div className="service-item">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSznXx580gR_EEFxADaATtQ0nvEdgAt_oaxMQ&s" alt="Best Prices" />
          <h4>Best Prices</h4>
          <p>We provide unbeatable prices with exclusive deals you won’t find anywhere else.</p>
        </div>
        <div className="service-item">
          <img src="https://whatfix.com/blog/wp-content/uploads/2024/03/247-customer-support.jpg" alt="24/7 Support" />
          <h4>24/7 Support</h4>
          <p>Our customer service is available around the clock to assist you with any needs.</p>
        </div>
        <div className="service-item">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTui4H3Ax98SXVScgsW0zQvSqQApHObkuECkw&s" alt="Flexible Cancellation" />
          <h4>Flexible Cancellation</h4>
          <p>We offer flexible booking and cancellation policies for your peace of mind.</p>
        </div>
      </div>
    </section>

    <section className="about-benefits">
      <div className="benefit-content">
        <h2>Travel with Confidence</h2>
        <p>At [Your Hotel Booking App], we ensure that every booking is secure, every stay is memorable, and every experience exceeds your expectations.</p>
        <ul>
          <li>Real-time availability and secure payments.</li>
          <li>Verified guest reviews and detailed property descriptions.</li>
          <li>Exclusive member offers and flash sales.</li>
          <li>Wide variety of hotels across prime locations.</li>
        </ul>
      </div>
      <div className="benefit-image">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCk34wBHlB2kN6n2AqwEZQeQgbbqdieCKfLw&s" alt="Travel with Confidence" />
      </div>
    </section>

    <section className="cta-section">
      <div className="cta-content">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Start exploring our curated list of hotels and book your next stay in just a few clicks. Let us take care of the details, so you can focus on the adventure.</p>
        
      </div>
    </section>
  </div>
);

export default About;
