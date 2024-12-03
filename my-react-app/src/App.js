//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchResults from './components/SearchResults';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AddBook from './components/AddBook';
import NavBar from './components/Layout/NavBar';
import Footer from './components/Layout/Footer';
import UserCheckouts from './components/UserCheckouts';
import ProfilePage from './pages/ProfilePage';
import Metrics from './pages/Metrics';
import OverdueFeePage from './pages/OverdueFeePage';


function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  // You should also check if the user is an admin here
  // This would require storing user info in localStorage or fetching it from the server
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
    <div>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/checkout" element={<UserCheckouts />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/overDue" element={<OverdueFeePage />} />
        
        {/*<Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
         Add other routes as needed */}
      </Routes>


      <Footer/>
    </div>
    </Router>
  );
}

export default App;
