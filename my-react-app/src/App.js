//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
    <div>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        { /* <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
         Add other routes as needed */}
      </Routes>
    </div>
    </Router>
  );
}

export default App;
