import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

function StudentPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState({});

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));

    axios
      .get(`http://localhost:8000/api/student-purchases/${student.id}/`,)
      .then((res) => {
        setPurchases(res.data.data);
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
      .then(() => {
        alert('✅ Review submitted successfully');
        setReviewText((prev) => ({ ...prev, [purchaseId]: '' }));
      })
      .catch((err) => {
        console.error('Review submission error:', err);
        alert('❌ Error submitting review');
      });
  };

  return (
    <div className="student-dashboard" style={{ padding: '20px' }}>
      <h2>📚 Your Borrowed Books</h2>
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Book</th>
            <th>Author</th>
            <th>Department</th>
            <th>Borrowed On</th>
            <th>Returned On</th>
            <th>Status</th>
            <th>Fine</th>
            <th>Review</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id}>
              <td>{purchase.book_name}</td>
              <td>{purchase.book_author}</td>
              <td>{purchase.book_department}</td>
              <td>{new Date(purchase.purchase_date).toLocaleDateString()}</td>
              <td>
                {purchase.submitted && purchase.submit_date
                  ? new Date(purchase.submit_date).toLocaleDateString()
                  : 'Not Returned'}
              </td>
              <td>{purchase.submitted ? '✅ Returned' : '📚 Not Returned'}</td>
              <td>₹{purchase.fine}</td>
              <td>
                <textarea
                  value={reviewText[purchase.id] || ''}
                  onChange={(e) => handleReviewChange(purchase.id, e.target.value)}
                  placeholder="Write a review..."
                  rows={2}
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
