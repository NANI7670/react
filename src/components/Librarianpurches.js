import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function LibrarianPurchase() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookIdFromQuery = queryParams.get('bookId');

  const [studentId, setStudentId] = useState('');
  const [summary, setSummary] = useState(null);
  const [bookDetails, setBookDetails] = useState(null);
  const [message, setMessage] = useState('');

  const fetchStudentSummary = async () => {
    try {
      const res = await axios.get(`/api/student/${studentId}/summary/`);
      setSummary(res.data);
      setMessage('');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error fetching student info');
    }
  };

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`/api/books/${bookIdFromQuery}/`);
      setBookDetails(res.data);
    } catch (err) {
      setMessage('Error fetching book details');
    }
  };

  const handleBorrow = async () => {
    try {
      const res = await axios.post('/api/borrow/', {
        student_id: studentId,
        book_id: bookIdFromQuery,
      });
      setMessage(res.data.message);
      fetchStudentSummary();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Borrow failed');
    }
  };

  useEffect(() => {
    if (bookIdFromQuery) {
      fetchBookDetails();
    }
  }, [bookIdFromQuery]);

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">📚 Book Purchase</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Student ID"
          className="border p-2 rounded"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <button onClick={fetchStudentSummary} className="bg-blue-500 text-white px-4 rounded">
          Search
        </button>
      </div>

      {summary && (
        <div className="border p-3 rounded bg-gray-100 mb-4">
          <p><strong>Student:</strong> {summary.student_name}</p>
          <p>📕 Total Borrowed: {summary.total_borrowed}</p>
          <p>📘 Returned: {summary.returned_books}</p>
          <p>📙 Pending: {summary.currently_borrowed}</p>
          <p>💸 Total Fine: ₹{summary.total_fine}</p>
        </div>
      )}

      {bookDetails && (
        <div className="border p-3 rounded bg-green-50 mb-4">
          <h3 className="text-lg font-semibold">Book to Purchase</h3>
          <p><strong>Title:</strong> {bookDetails.title}</p>
          <p><strong>Author:</strong> {bookDetails.author}</p>
          <p><strong>Department:</strong> {bookDetails.department}</p>
          <p><strong>Available:</strong> {bookDetails.available_copies}</p>
          {bookDetails.available_copies > 0 ? (
            <button onClick={handleBorrow} className="mt-2 bg-green-600 text-white px-4 py-1 rounded">
              Confirm Borrow
            </button>
          ) : (
            <p className="text-red-600 mt-2">Stock Over</p>
          )}
        </div>
      )}

      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}

export default LibrarianPurchase;