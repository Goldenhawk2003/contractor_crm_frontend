// ReviewList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL = 'https://ecc-backend-31b43c38f51f.herokuapp.com';

const StarRating = ({ ratingValue, onRate }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`star ${i <= (hoveredRating || ratingValue) ? "filled" : ""}`}
          onClick={() => onRate && onRate(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

const ReviewList = ({ contractorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
            `${BASE_URL}/contractors/${contractorId}/reviews/`,
            { headers: getAuthHeaders() }
          );
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [contractorId]);

  if (loading) return <p>Loading reviews…</p>;
  if (!reviews.length) return <p>No reviews yet.</p>;

  return (
    <div className="reviews-list">
      {reviews.map((r) => (
        <div key={r.id} className="review-card">
          <div className="review-header">
            <StarRating ratingValue={r.rating} readOnly />
            <small className="review-date">
              {new Date(r.created_at).toLocaleDateString()}
            </small>
          </div>
          {r.comment && <p className="review-comment">{r.comment}</p>}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;