import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

function StudentPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));

    axios
      .get(`http://localhost:8000/api/student-purchases/${student.id}/`)
      .then((res) => {
        setPurchases(res.data.data);
        console.log(res.data.data, '------res.data.data-----');
        
      })
      .catch((err) => {
        setError('Failed to fetch purchase data');
        console.error(err);
      });
  }, []);

  const handleReviewChange = (bookId, text) => {
    setReviewText((prev) => ({
      ...prev,
      [bookId]: text,
    }));
  };

  const submitReview = (bookId) => {
    
    const student = JSON.parse(localStorage.getItem('student'));

    axios
      .post('http://localhost:8000/api/save_book_review/', {
        book_id: bookId,
        student_id: student.id,
        review: reviewText,
      })
      .then(() => {
        alert('✅ Review submitted successfully');
        setReviewText((prev) => ({ ...prev, [bookId]: '' }));
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
              <td>{purchase.book_title}</td>
              <td>{purchase.book_author}</td>
              <td>{purchase.book_department}</td>
              <td>{purchase.purchase_date}</td>
              <td>
                {purchase.submit_date
                  ? purchase.submit_date
                  : 'Not Returned'}
              </td>
              <td>{purchase.submitted ? '✅ Returned' : '📚 Not Returned'}</td>
              <td>₹{purchase.fine}</td>
              <td>
                <textarea
                  // value={reviewText[purchase.book_id] || ''}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write a review..."
                  rows={2}
                  style={{ width: '100%' }}
                />
              </td>
              <td>
                <button onClick={() => submitReview(purchase.book)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentPurchases;
