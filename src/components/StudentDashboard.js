import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentDept, setStudentDept] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState({});
  const [visibleReviewId, setVisibleReviewId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showComplaintBox, setShowComplaintBox] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
<<<<<<< HEAD
    
=======
>>>>>>> 6230e10 (Updated register/login UI and CSS)
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    setFavorites(storedFavorites);

    if (student && student.department) {
      const corrected = student.department.replace(/'/g, '"');
      const obj = JSON.parse(corrected);
      setStudentDept(obj.name);
      fetchBooks(obj.name);
    } else {
      console.error('Student department not found.');
    }

    fetchDepartments();
  }, []);

  const fetchBooks = (departmentName) => {
    axios
      .get(`http://localhost:8000/api/bookslist/?department=${departmentName}`)
      .then((response) => setBooks(response.data))
      .catch((error) => {
        console.error('Error fetching books:', error);
        setBooks([]);
      });
  };

  const fetchDepartments = () => {
    axios
      .get('http://localhost:8000/api/departments/')
      .then((response) => setDepartments(response.data))
      .catch((error) => console.error('Error fetching departments:', error));
  };

  const toggleFavorite = (book) => {
    const isFavorite = favorites.some((fav) => fav.id === book.id);
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== book.id)
      : [...favorites, book];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const toggleReviewVisibility = (bookId) => {
    setVisibleReviewId((prev) => (prev === bookId ? null : bookId));
  };

  const handleReviewChange = (bookId, value) => {
    setReviews((prev) => ({ ...prev, [bookId]: value }));
  };

  const handleSaveReview = (bookId) => {
    const student = JSON.parse(localStorage.getItem('student'));
    const review = reviews[bookId];

    axios
      .post('http://localhost:8000/api/save_book_review/', {
        book_id: bookId,
        student_id: student.student_id,
        review,
      })
      .then(() => alert('✅ Review submitted successfully!'))
      .catch(() => alert('❌ Failed to submit review.'));
  };

  const handleSendComplaint = (recipient) => {
    const student = JSON.parse(localStorage.getItem('student'));
<<<<<<< HEAD
    console.log(student, '-----student-------');
=======
>>>>>>> 6230e10 (Updated register/login UI and CSS)

    // ✅ Corrected endpoint paths
    const endpoint =
      recipient === 'librarian'
<<<<<<< HEAD
        ? 'http://localhost:8000/api/complaint/send/'
=======
        ? 'http://localhost:8000/api/complaint/librarian/'
>>>>>>> 6230e10 (Updated register/login UI and CSS)
        : 'http://localhost:8000/api/complaint/admin/';

    axios
      .post(endpoint, {
        student_id: student.student_id,
        message: complaintText,
<<<<<<< HEAD
        sender: student.id
=======
>>>>>>> 6230e10 (Updated register/login UI and CSS)
      })
      .then(() => {
        alert(`✅ Complaint sent to ${recipient}!`);
        setComplaintText('');
        setShowComplaintBox(false);
      })
      .catch(() => {
        alert(`❌ Failed to send complaint to ${recipient}.`);
      });
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-dashboard">
      {/* ✅ NavBar */}
      <nav className="navbar">
        <div className="navbar-title">📚 Student Dashboard</div>
        <div className="navbar-controls">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setShowFavorites(!showFavorites)}>
            ⭐ Favorites ({favorites.length})
          </button>
          <button onClick={() => window.location.href = '/StudentProfile'}>👤 Profile</button>
          <button onClick={() => window.location.href = '/studentpurchases'}>🛒 Purchase</button>
          <button onClick={() => setShowComplaintBox(!showComplaintBox)}>⚠️ Complaint</button>
          <button
            onClick={() => {
              localStorage.removeItem('student');
              alert('Logged out!');
              window.location.href = '/studentlogin';
            }}
          >
            🔓 Logout
          </button>
        </div>
      </nav>

      {/* ✅ Complaint Box */}
      {showComplaintBox && (
        <div className="complaint-box">
          <textarea
            rows="4"
            cols="80"
            placeholder="Write your complaint here..."
            value={complaintText}
            onChange={(e) => setComplaintText(e.target.value)}
          />
          <br />
          <button onClick={() => handleSendComplaint('librarian')}>📩 Librarian Send</button>
          <button onClick={() => handleSendComplaint('admin')}>📤 Admin Send</button>
        </div>
      )}

      {/* ✅ Favorites Modal */}
      {showFavorites && (
        <div className="favorites-modal">
          <h3>⭐ Your Favorite Books</h3>
          {favorites.length === 0 ? (
            <p>No favorite books yet.</p>
          ) : (
            <table className="book-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>❌ Remove</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{departments.find((d) => d.id === book.department)?.name || 'Unknown'}</td>
                    <td>{book.publish_year}</td>
                    <td>{book.price}</td>
                    <td>
                      <button onClick={() => toggleFavorite(book)}>❌ Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ✅ Book List */}
      <div className="table-container">
        {filteredBooks.length > 0 ? (
          <table className="book-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Department</th>
                <th>Year</th>
                <th>Price (₹)</th>
                <th>Total</th>
                <th>Available</th>
                <th>❤️</th>
                <th>📝</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <React.Fragment key={book.id}>
                  <tr>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{departments.find((d) => d.id === book.department)?.name || 'Unknown'}</td>
                    <td>{book.publish_year}</td>
                    <td>{book.price}</td>
                    <td>{book.total_copies}</td>
                    <td>{book.available_copies}</td>
                    <td>
                      <button onClick={() => toggleFavorite(book)}>
                        {favorites.some((fav) => fav.id === book.id)
                          ? '💔 Remove'
                          : '❤️ Favorite'}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => toggleReviewVisibility(book.id)}>
                        {visibleReviewId === book.id ? '✖️ Close' : '📝 Review'}
                      </button>
                    </td>
                  </tr>
                  {visibleReviewId === book.id && (
                    <tr>
                      <td colSpan="9">
                        <textarea
                          rows="3"
                          cols="100"
                          value={reviews[book.id] || ''}
                          onChange={(e) => handleReviewChange(book.id, e.target.value)}
                          placeholder="Write your review here..."
                        />
                        <br />
                        <button onClick={() => handleSaveReview(book.id)}>✅ Submit Review</button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-4">😞 No books found in your department.</p>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;