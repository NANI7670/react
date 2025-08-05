import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LibrarianComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [hiddenIds, setHiddenIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    axios.get('http://localhost:8000/api/complaint/librarian/')
      .then(res => setComplaints(res.data))
      .catch(err => console.error('Error fetching complaints:', err));
  };

  const handleRemove = (id) => {
    setHiddenIds(prev => [...prev, id]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📩 Student Complaints</h2>

      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '10px 15px',
          marginBottom: '20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Go to Dashboard
      </button>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints
              .filter(complaint => !hiddenIds.includes(complaint.id))
              .map((complaint) => (
                <tr key={complaint.id}>
                  <td>{complaint.id}</td>
                  <td>{complaint.message}</td>
                  <td>{new Date(complaint.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleRemove(complaint.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#ffc107',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LibrarianComplaints;
