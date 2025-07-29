import React, { useState } from 'react';
import axios from 'axios';

function LibrarianLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/login/', { email, password });
      alert('Logged in!');
      window.location.href = '/librariandashboard';
    } catch (err) {
      alert('Login failed.');
    }
  };

  return (
    <div>
      <h2>Librarian Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LibrarianLogin;
