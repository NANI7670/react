import React, { useState } from 'react';
import axios from 'axios';
import '../styles/LibrarianLogin.css';

function LibrarianLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/labrarianlogin/', { email, password });
      alert('Logged in!');
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Login failed.');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url('/images/login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
    >
      <div className="login-container">
        <div className="login-card">
          <h2>Librarian Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <div className="redirect">
            <p>Don't have an account? <a href="/">Register here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibrarianLogin;