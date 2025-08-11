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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // NEW: Controls dropdown for favorites in navbar
  const [showFavoritesList, setShowFavoritesList] = useState(false);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
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
    fetchNotifications();
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

  const fetchNotifications = () => {
    const student = JSON.parse(localStorage.getItem('student'));
    axios
      .get(`http://localhost:8000/api/notifications/${student.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then((res) => setNotifications(res.data.data))
      .catch((err) => console.error('Error fetching notifications:', err));
  };

  const toggleFavorite = (book) => {
    const isFavorite = favorites.some((fav) => fav.id === book.id);
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.id !== book.id)
      : [...favorites, book];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const toggleReviewVisibility = async (bookId) => {
    if (visibleReviewId === bookId) {
      setVisibleReviewId(null);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/get_book_reviews/${bookId}/`);
      setReviews((prev) => ({
        ...prev,
        [bookId]: {
          text: '',
          all: response.data.reviews || [],
        },
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews((prev) => ({
        ...prev,
        [bookId]: {
          text: '',
          all: [],
        },
      }));
    }

    setVisibleReviewId(bookId);
  };

  const handleReviewChange = (bookId, value) => {
    setReviews((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        text: value,
      },
    }));
  };

  const handleSaveReview = (bookId) => {
    const student = JSON.parse(localStorage.getItem('student'));
    const review = reviews[bookId]?.text;

    axios
      .post('http://localhost:8000/api/save_book_review/', {
        book_id: bookId,
        student_id: student.student_id,
        review,
      })
      .then(() => {
        alert('✅ Review submitted successfully!');
        toggleReviewVisibility(bookId);
      })
      .catch(() => alert('❌ Failed to submit review.'));
  };

  const handleSendComplaint = (recipient) => {
    const student = JSON.parse(localStorage.getItem('student'));

    axios
      .post('http://localhost:8000/api/complaint/send/', {
        sender: student.id,
        message: complaintText,
        sent_to: recipient
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

  const handleNotifyMe = (bookId, bookTitle) => {
    const student = JSON.parse(localStorage.getItem('student'));
    axios
      .post(
        'http://localhost:8000/api/notify-request/',
        { book: bookId, student: student.id }
      )
      .then(() => alert(`🔔 You will be notified when '${bookTitle}' is available.`))
      .catch(() => alert('❌ Notification request failed.'));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-dashboard">
      <nav className="navbar">
        <div className="navbar-title">📚 Student Dashboard</div>
        <div className="navbar-controls">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowFavorites(!showFavorites);
                setShowFavoritesList(!showFavoritesList);
              }}
            >
              ⭐ Favorites ({favorites.length})
            </button>
            {showFavoritesList && favorites.length > 0 && (
              <div className="favorites-dropdown">
                <ul>
                  {favorites.map((fav) => (
                    <li key={fav.id}>{fav.title}</li>
                  ))}
                </ul>
              </div>
            )}
            {showFavoritesList && favorites.length === 0 && (
              <div className="favorites-dropdown">
                <p>No favorites yet.</p>
              </div>
            )}
          </div>
          <button onClick={() => setShowNotifications(!showNotifications)}>🔔 Notifications</button>
          <button onClick={() => (window.location.href = '/StudentProfile')}>👤 Profile</button>
          <button onClick={() => (window.location.href = '/studentpurchases')}>🛒 Purchase</button>
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

      {showNotifications && (
        <div className="notification-box">
          <h3>🔔 Notifications</h3>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((note) => (
                <li key={note.id}>
                  📘 <strong>{note.book_name}</strong>: {note.message} <em>({new Date(note.created_at).toLocaleString()})</em>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications yet.</p>
          )}
        </div>
      )}

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

      <div className="cards-container">
        {filteredBooks.map((book) => (
          <div className="book-card" key={book.id}>
            <h3>{book.title}</h3>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Department:</strong> {departments.find((d) => d.id === book.department)?.name || 'Unknown'}</p>
            <p><strong>Year:</strong> {book.publish_year}</p>
            <p><strong>Price:</strong> ₹{book.price}</p>
            <p><strong>Total:</strong> {book.total_copies}</p>
            <p>
              <strong>Available:</strong> {
                book.available_copies > 0 ? (
                  book.available_copies
                ) : (
                  <>
                    <span style={{ color: 'red' }}>Stock Over</span>
                    <br />
                    <button onClick={() => handleNotifyMe(book.id, book.title)}>🔔 NotifyMe</button>
                  </>
                )
              }
            </p>
            <div className="card-buttons">
              <button onClick={() => toggleFavorite(book)}>
                {favorites.some((fav) => fav.id === book.id)
                  ? '💔 Remove Favorite'
                  : '❤️ Add Favorite'}
              </button>
              <button onClick={() => toggleReviewVisibility(book.id)}>
                {visibleReviewId === book.id ? '✖️ Close Review' : '📝 Review'}
              </button>
            </div>

            {visibleReviewId === book.id && (
              <div className="review-section">
                <textarea
                  rows="3"
                  value={reviews[book.id]?.text || ''}
                  onChange={(e) => handleReviewChange(book.id, e.target.value)}
                  placeholder="Write your review here..."
                />
                <button onClick={() => handleSaveReview(book.id)}>✅ Submit Review</button>

                <div className="existing-reviews">
                  <h4>📖 Previous Reviews:</h4>
                  {reviews[book.id]?.all?.length > 0 ? (
                    <ul>
                      {reviews[book.id].all.map((rev, idx) => (
                        <li key={idx}>
                          <strong>{rev.student_name}:</strong> {rev.review}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No reviews yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDashboard;
