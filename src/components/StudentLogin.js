import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Studentlogin.css';


function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/student-login/', {
        email,
        password,
      });
      if (res.status === 200) {
        localStorage.setItem('student', JSON.stringify(res.data));
        navigate('/studentdashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/background.jpg)`,
      }}
    >
      <div className="login-container">
        {/* LEFT IMAGE */}
        

        {/* RIGHT FORM */}
        <div className="login-right">
          <h2>Student Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="text-danger">{error}</p>}

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;