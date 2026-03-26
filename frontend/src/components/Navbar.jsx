import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/find-rooms" className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              RoomSync
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/find-rooms" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">Find Rooms</Link>
            <Link to="/profile" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">Profile</Link>
            <Link to="/create-room" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">Create Room</Link>
            <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors font-medium">Owner Dashboard</Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 ml-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
