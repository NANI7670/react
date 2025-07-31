import React, { useState } from 'react';
import axios from 'axios';

function LibrarianPurchase() {
  const [studentID, setStudentID] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [message, setMessage] = useState('');

  const handleStudentSearch = () => {
    console.log(studentID, '----------studentID-------');
    
    axios.post(`http://localhost:8000/api/student/${studentID}/`)
      .then(res => {
        setStudentData(res.data);
        setMessage('');
        fetchDepartments();
      })
      .catch(() => {
        setMessage('❌ Student not found');
        setStudentData(null);
      });
  };

  const fetchDepartments = () => {
    axios.get('http://localhost:8000/api/departments/')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  };

  const fetchBooks = () => {
    axios.get('http://localhost:8000/api/books/')
      .then(res => {
        const deptBooks = res.data.filter(book => book.department_name === selectedDepartment);
        setBooks(deptBooks);
        setFilteredBooks(deptBooks);
      })
      .catch(err => console.error(err));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handlePurchase = () => {
    if (!selectedBook) return alert("Please select a book to purchase.");
    axios.post(`http://localhost:8000/api/borrow/`, {
      student_id: studentID,
      book_id: selectedBook.id
    }).then(() => {
      alert("✅ Book Borrowed Successfully");
      setSelectedBook(null);
      fetchBooks(); // refresh book list
    }).catch(err => {
      const error = err.response?.data?.error || '❌ Something went wrong';
      alert(error);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📖 Librarian - Purchase Page</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Student ID (e.g. CO123)"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
        />
        <button onClick={handleStudentSearch}>🔍 Search Student</button>
      </div>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {studentData && (
        <>
          <div style={{ marginTop: '20px' }}>
            <h3>🎓 Student Info</h3>
            <p><strong>ID:</strong> {studentData.student_id}</p>
            <p><strong>Name:</strong> {studentData.first_name} {studentData.last_name}</p>
            <p><strong>Email:</strong> {studentData.email}</p>
            <p><strong>Department:</strong> {studentData.department_name}</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>📂 Select Department</h3>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="">-- Choose Department --</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            <button onClick={fetchBooks} disabled={!selectedDepartment}>📚 Load Books</button>
          </div>
        </>
      )}

      {books.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>🔍 Search & Select Book</h3>
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearch}
          />

          <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredBooks.map(book => (
              <li key={book.id} onClick={() => handleBookClick(book)} style={{
                cursor: 'pointer',
                backgroundColor: selectedBook?.id === book.id ? '#dff0d8' : 'transparent',
                padding: '5px'
              }}>
                {book.title} ({book.available_copies} available)
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedBook && (
        <div style={{ marginTop: '20px' }}>
          <h3>🛒 Student Purchase</h3>
          <p><strong>Book Title:</strong> {selectedBook.title}</p>
          <p><strong>Department:</strong> {selectedBook.department_name}</p>
          <button onClick={handlePurchase}>✅ Confirm Borrow</button>
        </div>
      )}
    </div>
  );
}

export default LibrarianPurchase;
