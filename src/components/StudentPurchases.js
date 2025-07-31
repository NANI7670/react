import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

function StudentPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/student-purchases/', { withCredentials: true })
      .then((res) => {
        setPurchases(res.data);
      })
      .catch((err) => {
        setError('Failed to fetch purchase data');
        console.error(err);
      });
  }, []);

  const handleReviewChange = (purchaseId, text) => {
    setReviewText((prev) => ({
      ...prev,
      [purchaseId]: text,
    }));
  };

  const submitReview = (purchaseId) => {
    const review = reviewText[purchaseId];
    if (!review) return;

    axios
      .post(`http://localhost:8000/api/student-purchases/${purchaseId}/review/`, { review })
      .then((res) => {
        alert('Review submitted');
        setReviewText((prev) => ({ ...prev, [purchaseId]: '' }));
      })
      .catch((err) => {
        console.error('Review submission error:', err);
        alert('Error submitting review');
      });
  };

  const getStatus = (purchase) => {
    if (purchase.submitted) return 'Submitted';
    const purchasedDate = new Date(purchase.purchased_date);
    const now = new Date();
    const diff = Math.floor((now - purchasedDate) / (1000 * 60 * 60 * 24));
    if (diff > 3) return `Fine: ₹${(diff - 3) * 5}`;
    return 'Pending';
  };

  return (
    <div className="student-dashboard">
      <h2>📚 Your Purchase History</h2>
      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>Purchased On</th>
            <th>Status</th>
            <th>Review</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.book_name}</td>
              <td>{new Date(purchase.purchased_date).toLocaleDateString()}</td>
              <td>{getStatus(purchase)}</td>
              <td>
                <textarea
                  value={reviewText[purchase.id] || ''}
                  onChange={(e) => handleReviewChange(purchase.id, e.target.value)}
                  placeholder="Write a review..."
                />
              </td>
              <td>
                <button onClick={() => submitReview(purchase.id)}>Submit Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentPurchases;
