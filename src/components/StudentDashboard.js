import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

function StudentDashboard() {
  const [books, setBooks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentDept, setStudentDept] = useState(null);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('student'));
    console.log(student)
    if (student && student.department) {
      const deptId = student.department
      const corrected = deptId.replace(/'/g, '"');

const obj = JSON.parse(corrected);
      console.log(obj.name)
      setStudentDept(obj.name);
      fetchBooks(obj.name); // ✅ Correct use of departmentId
    } else {
      console.error('Student department not found.');
    }

    fetchDepartments();
  }, []);

  const fetchBooks = (departmentId) => {
    axios
      .get(`http://localhost:8000/api/bookslist/?department=${departmentId}`) // ✅ Fixed
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

  const handleLogout = () => {
    localStorage.removeItem('student');
    alert('Logged out!');
    window.location.href = '/studentlogin';
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
          <button onClick={() => window.location.href = '/StudentProfile'}>👤 Profile</button>

          <button onClick={() => window.location.href = '/studentpurchases'}>🛒 Purchase</button>

          <button onClick={handleLogout}>🔓 Logout</button>
        </div>
      </nav>

   

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
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    {departments.find((d) => d.id === book.department)?.name || 'Unknown'}
                  </td>
                  <td>{book.title}</td>
                  <td>{book.publish_year}</td>
                  <td>{book.price}</td>
                  <td>{book.total_copies}</td>
                  <td>{book.available_copies}</td>
                </tr>
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
