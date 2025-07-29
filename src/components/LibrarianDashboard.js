import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function LibrarianDashboard() {
  const [books, setBooks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [editRowId, setEditRowId] = useState(null);
  const [editedBook, setEditedBook] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchDepartments();
  }, []);

  const fetchBooks = () => {
    axios.get('http://localhost:8000/api/books/')
      .then(res => setBooks(res.data))
      .catch(err => console.error('Error fetching books:', err));
  };

  const fetchDepartments = () => {
    axios.get('http://localhost:8000/api/departments/')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      axios.delete(`http://localhost:8000/api/books/${id}/`)
        .then(() => fetchBooks())
        .catch(err => console.error('Delete error:', err));
    }
  };

  const handleEditClick = (book) => {
    setEditRowId(book.id);
    setEditedBook({ ...book });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = (id) => {
    axios.put(`http://localhost:8000/api/books/${id}/`, editedBook)
      .then(() => {
        fetchBooks();
        setEditRowId(null);
        setEditedBook({});
      })
      .catch(err => console.error('Update error:', err));
  };

  const handlePurchase = (id) => {
    navigate(`/Librarianpurches/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('librarianToken');
    navigate('/librarianlogin');
  };

  const filteredBooks = books.filter(book => {
    const matchesDept = selectedDept ? book.department === selectedDept : true;
    const matchesSearch = (book.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="librarian-dashboard">
      <nav className="navbar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <button onClick={() => navigate('/add-book')}>Add Book</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <table className="book-table">
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Department</th>
            <th>Publish Year</th>
            <th>Price</th>
            <th>Total</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBooks.length === 0 ? (
            <tr><td colSpan="8">No books found</td></tr>
          ) : (
            filteredBooks.map(book => (
              <tr key={book.id}>
                {editRowId === book.id ? (
                  <>
                    <td><input name="title" value={editedBook.name} onChange={handleEditChange} /></td>
                    <td><input name="author" value={editedBook.author} onChange={handleEditChange} /></td>
                    <td>
                      <select name="department" value={editedBook.department} onChange={handleEditChange}>
                        {departments.map((dept, i) => (
                          <option key={i} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </td>
                    <td><input name="publish_year" value={editedBook.publish_year} onChange={handleEditChange} /></td>
                    <td><input name="price" value={editedBook.price} onChange={handleEditChange} /></td>
                    <td><input name="total_books" value={editedBook.total_books} onChange={handleEditChange} /></td>
                    <td><input name="available_books" value={editedBook.available_books} onChange={handleEditChange} /></td>
                    <td>
                      <button onClick={() => handleUpdate(book.id)}>Save</button>
                      <button onClick={() => setEditRowId(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.department}</td>
                    <td>{book.Publisher_year}</td>
                    <td>{book.price}</td>
                    <td>{book.total_copies}</td>
                    <td>{book.available_copies}</td>
                    <td>
                      <button onClick={() => handleEditClick(book)}>Edit</button>
                      <button onClick={() => handleDelete(book.id)}>Delete</button>
                      <button onClick={() => handlePurchase(book.id)}>Purchase</button> 
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LibrarianDashboard;
