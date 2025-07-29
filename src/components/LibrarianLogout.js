import axios from 'axios';
import { useEffect } from 'react';

function LibrarianLogout() {
  useEffect(() => {
    axios.post('http://localhost:8000/api/librarianlogout/')
      .then(() => {
        alert('Logged out!');
        window.location.href = '/librarianlogin';
      });
  }, []);

  return <p>Logging out...</p>;
}

export default LibrarianLogout;
