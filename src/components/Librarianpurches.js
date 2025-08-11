import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LibrarianPurchase() {
  const [studentID, setStudentID] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadedBooks, setLoadedBooks] = useState([]);
  const [message, setMessage] = useState('');

  const handleStudentSearch = () => {
    if (!studentID) return;
    axios.post(`http://localhost:8000/api/student/${studentID}/`)
      .then(res => {
        setStudentData(res.data);
        setMessage('');
        fetchBooks();
        fetchBorrowedBooks();
      })
      .catch(() => {
        setMessage('❌ Student not found');
        setStudentData(null);
        setBorrowedBooks([]);
        setBooks([]);
      });
  };

  const fetchBooks = () => {
    axios.get('http://localhost:8000/api/books/')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  const fetchBorrowedBooks = () => {
    const student = JSON.parse(localStorage.getItem('student'));
    axios
      .get(`http://localhost:8000/api/student-purchases/${student.id}/`)
      .then((res) => {
        setBorrowedBooks(res.data.data);
      })
      .catch((err) => {
        setMessage('Failed to fetch purchase data');
        console.error(err);
      });
  };

  const handleLoadBook = (book) => {
    if (!loadedBooks.find(b => b.id === book.id)) {
      setLoadedBooks([...loadedBooks, book]);
    }
  };

  const handleBorrow = (book) => {
    const today = new Date();
    const borrow_date = today.toISOString().split('T')[0];
    const due = new Date(today);
    due.setDate(today.getDate() + 14);
    const due_date = due.toISOString().split('T')[0];

    axios.post('http://localhost:8000/api/borrow/', {
      student_id: studentID,
      book_id: book.id,
      borrow_date,
      due_date
    })
      .then(() => {
        alert('✅ Book borrowed successfully');
        fetchBooks();
        fetchBorrowedBooks();
        setLoadedBooks(loadedBooks.filter(b => b.id !== book.id));
      })
      .catch(err => {
        const msg = err.response?.data?.error || '❌ Failed to borrow';
        alert(msg);
      });
  };

  // ✅ Pay Fine
  const handlePayFine = (purchaseId) => {
    if (!window.confirm("Are you sure you want to mark the fine as paid?")) return;

    axios.post(`http://localhost:8000/api/pay-fine/${purchaseId}/`)
      .then(() => {
        alert("✅ Fine cleared");
        fetchBorrowedBooks();
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to clear fine");
      });
  };

  // ✅ Return Book
  const handleReturnBook = (purchaseId, bookId) => {
    axios.post(`http://localhost:8000/api/return-book/${purchaseId}/`, { book_id: bookId })
      .then(() => {
        alert("✅ Book returned successfully");
        fetchBooks();
        fetchBorrowedBooks();
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to return book");
      });
  };

  const calculateFine = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return daysLate > 0 ? `₹${daysLate * 10}` : '₹0';
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.publisher_year.toString().includes(searchQuery)
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2>📘 Librarian: Borrow Books</h2>

      {/* Search student */}
      <div>
        <input
          type="text"
          placeholder="Enter Student ID (e.g. CO123)"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
        />
        <button onClick={handleStudentSearch}>🔍 Search</button>
      </div>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {studentData && (
        <>
          {/* Student Info */}
          <div style={{ marginTop: '20px' }}>
            <h3>🎓 Student Info</h3>
            <p><strong>ID:</strong> {studentData.student_id}</p>
            <p><strong>Name:</strong> {studentData.first_name} {studentData.last_name}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
            <p><strong>Department:</strong> {studentData.department_name}</p>
          </div>

          {/* Book Search */}
          <div style={{ marginTop: '20px' }}>
            <h3>📚 Book Search</h3>
            <input
              type="text"
              placeholder="Search by title, author, year"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '60%', padding: '8px' }}
            />
            <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '10px' }}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Available</th>
                  <th>LoadBook</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.publisher_year}</td>
                    <td>{book.available_copies}</td>
                    <td>
                      <button onClick={() => handleLoadBook(book)}>📥 Load</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Loaded Books */}
          {loadedBooks.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>📦 Books to Borrow</h3>
              <table border="1" cellPadding="10" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Due Date</th>
                    <th>Borrow</th>
                  </tr>
                </thead>
                <tbody>
                  {loadedBooks.map(book => {
                    const due = new Date();
                    due.setDate(due.getDate() + 14);
                    return (
                      <tr key={book.id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.publisher_year}</td>
                        <td>{due.toLocaleDateString()}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <button onClick={() => handleBorrow(book)}>✅ Borrow</button>
                            <button onClick={() =>
                              setLoadedBooks(loadedBooks.filter(b => b.id !== book.id))
                            }>❌ Remove</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Borrowed Book List */}
          {borrowedBooks.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>🧾 Already Borrowed Books</h3>
              <table border="1" cellPadding="10" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Borrowed On</th>
                    <th>Due Date</th>
                    <th>Fine</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.map(b => (
                    <tr key={b.id}>
                      <td>{b.book_title}</td>
                      <td>{b.borrow_date}</td>
                      <td>{b.due_date}</td>
                      <td>
                        {b.fine}/-
                        <button 
                          style={{ marginLeft: "5px" }} 
                          onClick={() => handlePayFine(b.id)}
                        >
                          💰 Paid
                        </button>
                      </td>
                      <td>
                        <button onClick={() => handleReturnBook(b.id, b.book)}>↩ Return Book</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LibrarianPurchase;