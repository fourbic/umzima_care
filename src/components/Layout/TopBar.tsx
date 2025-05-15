import { Bell, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
  };

  // Check system preference for dark mode
  useEffect(() => {
    if (localStorage.theme === 'dark' || (
      !('theme' in localStorage) && 
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  return (
    <header className="h-16 w-full bg-white shadow dark:bg-gray-800">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-primary-dark">
            {user?.role === 'admin' ? 'Admin Dashboard' : 
              user?.role === 'doctor' ? 'Doctor\'s Dashboard' : 'Nurse Dashboard'}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleDarkMode}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
            <Bell size={20} />
            <span className="absolute -right-0 -top-0 h-4 w-4 rounded-full bg-primary-bright text-xs font-medium text-primary-dark flex items-center justify-center">
              2
            </span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center rounded-full text-gray-700 focus:outline-none dark:text-gray-200"
            >
              <div className="h-8 w-8 rounded-full bg-accent-green-1 flex items-center justify-center text-white">
                {user?.name.charAt(0)}
              </div>
              <span className="ml-2 hidden text-sm font-medium md:block">{user?.name}</span>
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Settings size={16} className="mr-2" />
                  Account Settings
                </button>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;