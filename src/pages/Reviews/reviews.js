import React, { useEffect, useState } from 'react';
import './reviews.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Reviews() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [ratingsSummary, setRatingsSummary] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
    const [newComment, setNewComment] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);

    useEffect(() => {
        fetch("https://hotel-backend-1-8plr.onrender.com/api/feedback")
            .then(response => response.json())
            .then(data => {
                setFeedbacks(data);
                calculateRatingsSummary(data);
            })
            .catch(error => console.error("Error fetching feedback:", error));
    }, []);

    const calculateRatingsSummary = (data) => {
        const summary = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach(fb => {
            summary[fb.ratings]++;
        });
        setRatingsSummary(summary);
    };

    const renderStars = (rating, onClick) => {
        return [...Array(5)].map((_, index) => (
            <span
                key={index}
                className={`star ${index < rating ? 'filled-star' : 'empty-star'}`}
                onClick={() => onClick && onClick(index + 1)}
                role="button"
                aria-label={`Rate ${index + 1} star`}
            >
                ★
            </span>
        ));
    };

    const handleAddComment = () => {
        if (!newComment.trim() || selectedRating === 0) {
            alert("Please provide a comment and select a rating.");
            return;
        }

        const newFeedback = {
            feedback: newComment,
            ratings: selectedRating
        };

        const token = localStorage.getItem("token");

        fetch("https://hotel-backend-1-8plr.onrender.com/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newFeedback),
        })
        .then(response => response.json())
        .then(data => {
            setFeedbacks(prevFeedbacks => [...prevFeedbacks, data]);
            setNewComment("");
            setSelectedRating(0);
            calculateRatingsSummary([...feedbacks, data]);
        })
        .catch(error => console.error("Error adding feedback:", error));
    };

    const getTotalReviews = () => feedbacks.length;
    const getRatingPercentage = (count) => (count / getTotalReviews()) * 100 || 0;

    return (
        <div className="container review-page-container py-4">
            <div className="row mb-4">
                <div className="add-comment col-md-6">
                    <h2 className="mb-3">Leave a Review</h2>
                    <div className="rating-input d-flex align-items-center mb-3">
                        <label className="me-2">Rate your experience:</label>
                        <div className="star-input">
                            {renderStars(selectedRating, setSelectedRating)}
                        </div>
                    </div>
                    <textarea
                        className="form-control mb-3"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here..."
                        rows="3"
                    ></textarea>
                    <button className="button" onClick={handleAddComment}>Submit Comment</button>
                </div>
                <div className="review-summary col-md-6">
                    <h2 className="mb-3">Overall Ratings</h2>
                    <p>{getTotalReviews()} global ratings</p>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="rating-bar d-flex align-items-center mb-2">
                            <span className="star-label">{star} star</span>
                            <div className="progress flex-grow-1 mx-2">
                                <div
                                    className="progress-bar bg-warning"
                                    role="progressbar"
                                    style={{ width: `${getRatingPercentage(ratingsSummary[star])}%` }}
                                ></div>
                            </div>
                            <span className="percentage">{getRatingPercentage(ratingsSummary[star]).toFixed(0)}%</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="review-list">
                <h2>Customer Reviews</h2>
                <div className="row">
                    {feedbacks.map((fb, index) => (
                        <div key={index} className="col-md-6 mb-4">
                            <div className="feedback-card card p-3 shadow-sm">
                                <h5 className="review-name">{fb.name}</h5>
                                <p className="review-text">{fb.feedback}</p>
                                <div className="review-stars">{renderStars(fb.ratings)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reviews;
