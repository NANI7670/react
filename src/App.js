// App.js ✅ FIXED
import { Routes, Route } from 'react-router-dom';
import LibrarianLogin from './components/LibrarianLogin';
import LibrarianRegister from './components/LibrarianRegister';
import LibrarianDashboard from './components/LibrarianDashboard';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import StudentRegister from './components/StudentRegister';
import StudentLogin from './components/StudentLogin';
import StudentDashboard from './components/StudentDashboard.js';
import StudentProfile from './components/StudentProfile';
import Librarianpurches from './components/Librarianpurches';
import StudentPurchases from './components/StudentPurchases';
import LibrarianComplaints from './components/LibrarianComplaints';

function App() {
  return (
    <Routes>
      <Route path="login/" element={<LibrarianLogin />} />
      <Route path="/" element={<LibrarianRegister />} />
      <Route path="/dashboard" element={<LibrarianDashboard />} />
      <Route path="/add-book" element={<BookForm />} />
      <Route path="/books" element={<BookList />} />
      <Route path="/studentregister" element={<StudentRegister />} />
      <Route path="/studentlogin" element={<StudentLogin />} />
       <Route path="/studentdashboard" element={<StudentDashboard />} />
       <Route path="/studentprofile" element={<StudentProfile />} />
       <Route path="/librarianpurches/:id" element={<Librarianpurches />} />
       <Route path="/studentpurchases" element={<StudentPurchases />} />
       <Route path="/LibrarianComplaints" element={<LibrarianComplaints />} />
    </Routes>
  );
}

export default App;
