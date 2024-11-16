import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';

function Home() {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [fastFacts, setFastFacts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?cs=srgb&dl=pexels-pixabay-261102.jpg&fm=jpg',
    'https://www.welcome-hotels.com/site/assets/files/35059/welcome_hotel_marburg_lobby_2k.2560x1600.jpg',
    'https://image-tc.galaxy.tf/wijpeg-9vualzt3dbue0hi00ba4q49ub/chatwalhotelnyc-c-004-build-crop.jpg?width=1920',
    'https://washington.org/sites/default/files/styles/menu_pods_504_x_380/public/thumb_accommodations-listing-page_mandarin-oriental-lobby_credit-mandarin_1600x432.jpg.webp?itok=HEgaGS9h',
    'https://s3-media0.fl.yelpcdn.com/bphoto/1MIzfpayIbxHnXWm38yG9g/348s.jpg'
  ];

  useEffect(() => {
    // Initialize Fast Facts data
    setFastFacts([
      { label: "Accommodations", value: "1,948 Properties" },
      { label: "Popular hotel", value: "Ibis Amsterdam Centre" },
      { label: "Popular area", value: "Amsterdam-Centrum" },
      { label: "Nightly rates from", value: "₹1051" },
      { label: "Airport", value: "Amsterdam Airport Schiphol" },
      { label: "Reasons to visit", value: "Museum & Arts, Sightseeing, Culture" }
    ]);

    // Initialize FAQ data
    setFaqs([
      {
        question: "What will happen after I sign up?",
        answer: "You sign up for an account and create your listing. You can update your calendar, prices, and confirm your listing is accurate. When you’re ready, you open your property for bookings."
      },
      {
        question: "Will I be able to update my registration details at a later date?",
        answer: "Once you’ve registered, you can update your details anytime."
      },
      {
        question: "What kinds of photos should I upload?",
        answer: "Upload photos showcasing both the inside and outside of your property."
      },
      {
        question: "When will my property go online?",
        answer: "Once you finish creating your listing, you can open your property for bookings."
      },
      {
        question: "What do I get for the commission I pay?",
        answer: "You get a powerful online presence, innovative tools, instant confirmation, verified guest reviews, and 24/7 support."
      },
      {
        question: "How can I request an invoice?",
        answer: "Please go to your confirmation email or the confirmation page and click 'Request an invoice'. Complete the form and submit your request. If you don’t see the link, please go to the Help Centre for assistance."
      }
    ]);

    // Initialize Testimonials data
    setTestimonials([
      { name: "Aria", review: "Amazing service and a great stay at the hotel!" },
      { name: "Akhil", review: "Booking process was smooth and the hotel exceeded expectations." },
      { name: "Tharun", review: "Great support and wonderful accommodation choices." }
    ]);

    // Automatically cycle images every 3 seconds
    const imageCycle = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(imageCycle);
  }, [images.length]);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  
  return (
    <div className="home-page-container container-fluid">
      <h1 className="home-page-title display-4 text-center">Welcome to Our Hotel Booking Service</h1>

      <div className="home-page-content">
        {/* Fast Facts Section */}
        <div className="home-page-fast-facts">
          {fastFacts.map((fact, index) => (
            <div key={index} className="fast-fact-box">
              <div
                className="fast-fact-image"
                style={{ backgroundImage: `url(${images[(currentImageIndex + index) % images.length]})` }}
              />
              <div className="fast-fact-text">
                <h3>{fact.label}</h3>
                <p>{fact.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="home-page-images">
          <div className="slideshow-container">
            {images.map((image, index) => (
              <div
                key={index}
                className={`slide ${currentImageIndex === index ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
        </div>
      </div>

      <h2 className="home-page-faq-title display-6 text-center">Frequently Asked Questions (FAQs)</h2>
      <div className="home-page-faq-section bg-light p-3 rounded">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`home-page-faq-item ${openFAQ === index ? 'active' : ''}`}
          >
            <div className="home-page-faq-question d-flex justify-content-between align-items-center p-2" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="home-page-faq-toggle">{openFAQ === index ? "▲" : "▼"}</span>
            </div>
            <div className="home-page-faq-answer">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="home-page-testimonials mt-5">
        <h2 className="display-6 text-center">What Our Users Say</h2>
        <div className="row">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="col-md-4 col-sm-6 mb-3">
              <div className="testimonial-card p-3">
                <p className="testimonial-review">"{testimonial.review}"</p>
                <p className="testimonial-name">- {testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-page-cta my-5 p-4 bg-white text-center shadow rounded">
        <h2 className="display-6">Start Your Journey Today</h2>
        <p>Book a hotel, explore new destinations, and make memories that last a lifetime.</p>
        <button className="button">Explore Hotels</button>
      </div>
    </div>
  );
}

export default Home;
