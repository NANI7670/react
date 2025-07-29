import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentPurchases() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
    if (!student || !student.student_id) {
      alert("Student not logged in.");
      return;
    }

    axios
      .get(`http://localhost:8000/api/student/${student.student_id}/summary/`)
      .then((response) => {
        setBorrowedBooks(response.data.borrowed_books || []);
      })
      .catch((error) => {
        console.error('Error fetching student borrow summary:', error);
      });
  }, []);

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <div className="navbar-title">📖 My Purchases</div>
        <div className="navbar-controls">
          <button onClick={() => window.location.href = '/studentdashboard'}>🏠 Dashboard</button>
          <button onClick={() => window.location.href = '/StudentProfile'}>👤 Profile</button>
        </div>
      </nav>

      <div className="table-container">
        {borrowedBooks.length > 0 ? (
          <table className="book-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Returned</th>
                <th>Fine (₹)</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.book_title}</td>
                  <td>{entry.borrow_date}</td>
                  <td>{entry.return_date}</td>
                  <td>{entry.returned ? '✅ Yes' : '❌ No'}</td>
                  <td>{entry.fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-4">😞 No books borrowed yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentPurchases;
