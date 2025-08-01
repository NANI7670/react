import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';



function StudentRegister() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: '',
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load departments from backend
    axios.get('http://localhost:8000/api/departments/')
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to load departments", err));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { first_name, last_name, email, department, password, confirmPassword } = formData;

    if (!first_name || !last_name || !email || !department || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/register/', {
        first_name,
        last_name,
        email,
        department,
        password,
      });

      if (res.status === 201) {
        setSuccess('Registration successful! Please log in.');
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          department: '',
          password: '',
          confirmPassword: '',
        });
        setError('');
        setTimeout(() => {
          navigate('/studentlogin');
        }, 2000);
      }
    } catch (err) {
      setError('Registration failed. Try a different email or check backend.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Student Register</h2>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            className="form-control"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-2">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-2">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-2">
          <label>Department</label>
          <select
            name="department"
            className="form-control"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group mb-2">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>

      <p className="mt-3 text-center">
        Already registered? <Link to="/studentlogin">Login</Link>
      </p>
    </div>
  );
}

export default StudentRegister;
