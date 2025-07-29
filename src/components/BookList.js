import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BookList.css';
import { useNavigate } from 'react-router-dom';

function BookList() {
  const [books, setBooks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  const fetchBooks = () => {
    axios.get('http://localhost:8000/api/books/')
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err));
  };

  useEffect(() => {
    fetchBooks();
    axios.get('http://localhost:8000/api/departments/')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  const handleEditClick = (book) => {
    setEditingBookId(book.id);
    setEditData(book);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    axios.put(`http://localhost:8000/api/books/${editingBookId}/`, editData)
      .then(() => {
        alert('Book updated successfully!');
        setEditingBookId(null);
        fetchBooks();
      })
      .catch(err => {
        console.error('Error updating book:', err.response?.data || err.message);
      });
  };

  const handleCancel = () => {
    setEditingBookId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      axios.delete(`http://localhost:8000/api/books/${id}/`)
        .then(() => {
          alert('Book deleted successfully!');
          fetchBooks();
        })
        .catch(err => console.error('Error deleting book:', err));
    }
  };

  // ✅ Filter books by title and department
  const filteredBooks = books.filter(book =>
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.department_name || '').toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedDepartment === '' || book.department === parseInt(selectedDepartment))
  );

  return (
    <div className="book-list-container">
      <div className="top-bar">
        <h2>📚 Library Book List</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by Title or Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* ✅ Department filter dropdown */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>

          <button className="add-button" onClick={() => navigate('/add-book')}>
            ➕ Add Book
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Department</th><th>Year</th>
            <th>Price</th><th>Total</th><th>Available</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length === 0 ? (
            <tr><td colSpan="8">No books found.</td></tr>
          ) : (
            filteredBooks.map(book => (
              editingBookId === book.id ? (
                <tr key={book.id}>
                  <td><input name="title" value={editData.title} onChange={handleEditChange} /></td>
                  <td><input name="author" value={editData.author} onChange={handleEditChange} /></td>
                  <td>
                    <select name="department" value={editData.department} onChange={handleEditChange}>
                      {departments.map(dep => (
                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                      ))}
                    </select>
                  </td>
                  <td><input name="publish_year" type="number" value={editData.publish_year} onChange={handleEditChange} /></td>
                  <td><input name="price" type="number" value={editData.price} onChange={handleEditChange} /></td>
                  <td><input name="total_copies" type="number" value={editData.total_copies} onChange={handleEditChange} /></td>
                  <td><input name="available_copies" type="number" value={editData.available_copies} onChange={handleEditChange} /></td>
                  <td>
                    <button onClick={handleSave}>💾 Save</button>
                    <button onClick={handleCancel}>❌ Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.department_name || 'N/A'}</td>
                  <td>{book.publish_year}</td>
                  <td>{book.price}</td>
                  <td>{book.total_copies}</td>
                  <td>{book.available_copies}</td>
                  <td>
                    <button onClick={() => handleEditClick(book)}>EDIT</button>
                    <button onClick={() => handleDelete(book.id)} className="delete-btn">DELETE</button>
                  </td>
                </tr>
              )
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
