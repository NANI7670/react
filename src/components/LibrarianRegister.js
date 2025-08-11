import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LibrarianForm.css';


function LibrarianRegister() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/librarianregister/', formData);
      alert('Registered successfully!');
    } catch (err) {
      alert('Registration failed.');
    }
  };

  return (
    <div
  className="register-page"
  style={{
    backgroundImage: `url('/images/register.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh'
  }}
>
      <div className="register-container register-right">
        <h2>Librarian Register</h2>
        <form onSubmit={handleSubmit}>
          <input name="first_name" placeholder="First Name" onChange={handleChange} /><br />
          <input name="last_name" placeholder="Last Name" onChange={handleChange} /><br />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} /><br />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} /><br />
          <input name="confirm_password" placeholder="Confirm Password" type="password" onChange={handleChange} /><br />
          <button type="submit">Register</button>
          <p>Already registered? <a href="/login">Login here</a></p>
        </form>
      </div>
    </div>
  );
}

export default LibrarianRegister;