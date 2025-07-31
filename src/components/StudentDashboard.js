import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchPurchases();
    fetchDepartments();
    fetchNotifications();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/student/purchases/');
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/departments/');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/notifications/');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotify = async (bookId) => {
    try {
      await axios.post('http://localhost:8000/api/notify-request/', {
        book: bookId,
      });
      alert('Notification request submitted!');
    } catch (error) {
      console.error('Notification request error:', error);
      alert('Failed to request notification');
    }
  };

  const handlePurchase = async (bookId) => {
    try {
      await axios.post(`http://localhost:8000/api/student/purchase/${bookId}/`);
      alert('✅ Book purchased successfully!');
      fetchPurchases(); // refresh purchases
    } catch (error) {
      console.error('Purchase error:', error);
      alert('❌ Failed to purchase book.');
    }
  };

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedDept === '' || book.department === selectedDept)
  );

  return (
    <div className="student-dashboard">
      <h2>📚 Student Dashboard</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
      </div>

      <div className="book-section">
        <h3>Available Books</h3>
        {filteredBooks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Author</th>
                <th>Year</th>
                <th>Price</th>
                <th>Dept</th>
                <th>Available</th>
                <th>Notify</th>
                <th>Purchase</th> {/* ✅ Added header */}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map(book => (
                <tr key={book.id}>
                  <td>{book.name}</td>
                  <td>{book.author}</td>
                  <td>{book.publish_year}</td>
                  <td>{book.price}</td>
                  <td>{book.department}</td>
                  <td>{book.available_books}</td>
                  <td>
                    {book.available_books === 0 ? (
                      <button onClick={() => handleNotify(book.id)}>🔔 Notify Me</button>
                    ) : (
                      '✅'
                    )}
                  </td>
                  <td>
                    {book.available_books > 0 && (
                      <button onClick={() => handlePurchase(book.id)}>🛒 Purchase</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No books found.</p>
        )}
      </div>

      <div className="purchase-section">
        <h3>📘 Borrowed Books</h3>
        {purchases.length > 0 ? (
          <ul>
            {purchases.map(p => (
              <li key={p.id}>
                {p.book.name} - Borrowed: {p.purchase_date} - Submitted: {p.submitted ? '✅ Yes' : '❌ No'} - Fine: ₹{p.fine}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't borrowed any books yet.</p>
        )}
      </div>

      <div className="notification-section">
        <h3>🔔 Notifications</h3>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map(n => (
              <li key={n.id}>
                <strong>{n.book_name}</strong>: {n.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications yet.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
