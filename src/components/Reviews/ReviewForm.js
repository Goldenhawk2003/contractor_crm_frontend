// ReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css'; // Assuming you have some CSS for styling

// Backend base URL (Heroku)
const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';

// StarRating component for selecting 1-5 stars
const StarRating = ({ ratingValue, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= (hoveredRating || ratingValue) ? 'filled' : ''}`}
          onClick={() => onRate(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ReviewForm = ({ contractorId, onSuccess }) => {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError]     = useState('');

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('You must be logged in to submit a review.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Please give a rating between 1 and 5 stars.');
      return;
    }

    try {
      const payload = { rating, comment };
      // Use Heroku backend URL
      const url = `${BASE_URL}/contractors/${contractorId}/reviews/`;
      console.log('POSTing review to:', url);
      console.log("Submitting review:", payload);
console.log("Contractor ID:", contractorId);
      await axios.post(
        url,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRating(0);
      setComment('');
      onSuccess();  // notify parent to refresh reviews
    } catch (err) {
      console.error('Review submit failed', err);
      setError(err.response?.data?.detail || 'Submission failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Leave a review</h4>
      {error && <p className="error-text">{error}</p>}

      <StarRating ratingValue={rating} onRate={setRating} />

      <textarea
        name="comment"
        rows={3}
        className="review-comment-input"
        placeholder="Your comments (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit" className="submit-review-button">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
