import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/BookForm.css';

function BookForm() {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    department: '',
    publisher_year: '',  // ✅ Matches Django field
    price: '',
    total_copies: '',
    available_copies: ''
  });

  // Fetch departments from the backend
  useEffect(() => {
    axios.get('http://localhost:8000/api/departments/')
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  // Handle form field changes
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form data to backend
  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/books/', formData)
      .then(response => {
        alert('✅ Book added successfully!');
        // Reset the form
        setFormData({
          title: '',
          author: '',
          department: '',
          publisher_year: '',
          price: '',
          total_copies: '',
          available_copies: ''
        });
      })
      .catch(error => {
        console.error('❌ Error adding book:', error.response?.data || error.message);
        alert("❌ Failed to add book. Check console for details.");
      });
  };

  return (
    <div className="book-form-container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required /><br />
        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" required /><br />

        <select name="department" value={formData.department} onChange={handleChange} required>
          <option value="">Select Department</option>
          {departments.map(dep => (
            <option key={dep.id} value={dep.id}>{dep.name}</option>
          ))}
        </select><br />

        <input
          name="publisher_year"
          value={formData.publisher_year}
          onChange={handleChange}
          placeholder="Publisher Year"
          type="number"
          required
        /><br />

        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required /><br />
        <input name="total_copies" value={formData.total_copies} onChange={handleChange} placeholder="Total Copies" type="number" required /><br />
        <input name="available_copies" value={formData.available_copies} onChange={handleChange} placeholder="Available Copies" type="number" required /><br />

        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export default BookForm;
