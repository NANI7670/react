import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentProfile.css';

const StudentProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    profile_pic: null,
  });

  const fetchProfile = async (stuId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/register/${stuId}/`);
      setProfileData(response.data.data);
      
      setUpdatedData({
        first_name: response.data.data.first_name,
        last_name: response.data.data.last_name,
        email: response.data.data.email,
        department: response.data.data.department_id || response.data.data.department,
        profile_pic: null,
      });
      
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    const studentId = JSON.parse(localStorage.getItem("student"));
  const stuId = studentId.id
  
    if (studentId) {
      fetchProfile(stuId);
      fetchDepartments();
    } else {
      console.warn("Student ID not found in localStorage");
    }
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/departments/');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_pic') {
      setUpdatedData({ ...updatedData, profile_pic: files[0] });
    } else {
      setUpdatedData({ ...updatedData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('first_name', updatedData.first_name);
    formData.append('last_name', updatedData.last_name);
    formData.append('email', updatedData.email);
    formData.append('department_id', updatedData.department);
    if (updatedData.profile_pic) {
      formData.append('profile_pic', updatedData.profile_pic);
    }

    try {
      await axios.put(`http://localhost:8000/api/register/${studentId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setIsEditing(false);
      fetchProfile(); // refresh updated data
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!profileData) return <p>Loading profile...</p>;

  return (
    <div className="profile-card">
      <div className="profile-left">
        <img
          src={
            profileData.profile_pic
              ? `http://localhost:8000${profileData.profile_pic}`
              : 'https://via.placeholder.com/150'
          }
          alt="Profile"
          className="profile-pic"
        />
        {isEditing && (
          <input
            type="file"
            name="profile_pic"
            accept="image/*"
            onChange={handleChange}
          />
        )}
      </div>

      <div className="profile-right">
        {["first_name", "last_name", "email", "student_id"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace("_", " ")}:</label>
            {isEditing ? (
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={updatedData[field]}
                onChange={handleChange}
              />
            ) : (
              <p>{profileData[field]}</p>
            )}
          </div>
        ))}

        <div className="form-group">
          <label>Department:</label>
          {isEditing ? (
            <select
              name="department"
              value={updatedData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          ) : (
            <p>{profileData.department_name || profileData.department}</p>
          )}
        </div>

        <div className="button-group">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSubmit}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
