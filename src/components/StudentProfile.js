import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentPurchases() {
  const [studentData, setStudentData] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [reviewText, setReviewText] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
    if (!student || !student.student_id) {
      alert("Student not logged in.");
      return;
    }

    axios.get(`http://localhost:8000/api/student/${student.student_id}/summary/`)
      .then(res => {
        setStudentData(res.data.student);
        setBorrowedBooks(res.data.borrowed_books);
      })
      .catch(err => console.error(err));
  }, [refresh]);

  const handleBorrow = () => {
    const student = JSON.parse(localStorage.getItem('student'));
    axios.post('http://localhost:8000/api/borrow/', {
      student_id: student.student_id,
      book_id: selectedBookId
    }).then(() => {
      alert("Book Borrowed Successfully");
      setRefresh(!refresh);
    }).catch(err => {
      alert(err.response.data.error);
    });
  };

  const handleReturn = (borrow_id) => {
    axios.post('http://localhost:8000/api/return/', {
      borrow_id
    }).then(() => {
      alert("Book Returned Successfully");
      setRefresh(!refresh);
    }).catch(err => alert("Error returning book"));
  };

  const handleReviewSubmit = (borrow_id) => {
    const review = reviewText[borrow_id];
    if (!review || review.trim() === "") {
      alert("Please enter a review before submitting.");
      return;
    }

    axios.post('http://localhost:8000/api/submit_review/', {
      borrow_id,
      review
    }).then(() => {
      alert("Review submitted!");
      setReviewText((prev) => ({ ...prev, [borrow_id]: '' }));
    }).catch(err => {
      alert("Error submitting review.");
    });
  };

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <h2>📚 Student Borrow Dashboard</h2>
        <div>
          <button onClick={() => window.location.href = '/studentdashboard'}>🏠 Home</button>
          <button onClick={() => window.location.href = '/StudentProfile'}>👤 Profile</button>
        </div>
      </nav>

      {studentData && (
        <div className="student-info">
          <p><strong>Student ID:</strong> {studentData.student_id}</p>
          <p><strong>Name:</strong> {studentData.name}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
        </div>
      )}

      <div>
        <input
          type="number"
          placeholder="Enter Book ID to Borrow"
          onChange={(e) => setSelectedBookId(e.target.value)}
        />
        <button onClick={handleBorrow}>📘 Purchase</button>
      </div>

      <div className="table-container">
        <h3>Borrowed Books</h3>
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Borrow Date</th>
              <th>Due</th>
              <th>Returned</th>
              <th>Fine</th>
              <th>Action</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {borrowedBooks.map((b) => (
              <tr key={b.id}>
                <td>{b.book_title}</td>
                <td>{b.borrow_date}</td>
                <td>{b.return_date}</td>
                <td>{b.returned ? '✅' : '❌'}</td>
                <td>{b.fine}</td>
                <td>
                  {!b.returned && (
                    <button onClick={() => handleReturn(b.id)}>Return Book</button>
                  )}
                </td>
                <td>
                  {b.returned ? (
                    <div>
                      <input
                        type="text"
                        placeholder="Write a review"
                        value={reviewText[b.id] || ''}
                        onChange={(e) =>
                          setReviewText({ ...reviewText, [b.id]: e.target.value })
                        }
                      />
                      <button onClick={() => handleReviewSubmit(b.id)}>Submit</button>
                    </div>
                  ) : (
                    <span>Return first</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentPurchases;
