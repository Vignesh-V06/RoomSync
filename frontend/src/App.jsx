import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import FindRooms from './pages/FindRooms';
import CreateRoom from './pages/CreateRoom';
import OwnerDashboard from './pages/OwnerDashboard';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300 ease-in-out">
          <Navbar />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/find-rooms" element={
              <ProtectedRoute><FindRooms /></ProtectedRoute>
            } />
            <Route path="/create-room" element={
              <ProtectedRoute><CreateRoom /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><OwnerDashboard /></ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to="/find-rooms" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
    </ThemeProvider>
  );
}

export default App;
