import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageSquare, FileText, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
    { name: 'Appointments', path: '/appointments', icon: <Calendar size={20} /> },
    { name: 'Messages', path: '/messages', icon: <MessageSquare size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  // Add Settings for admin users
  if (user?.role === 'admin') {
    navigationItems.push({ name: 'Settings', path: '/settings', icon: <Settings size={20} /> });
  }

  const sidebarClasses = `fixed lg:relative z-40 transition-all duration-300 ${
    expanded ? 'w-64' : 'w-20'
  } bg-primary-dark h-full text-white flex flex-col`;

  const mobileSidebarClasses = `fixed z-40 transition-all duration-300 ${
    mobileOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0 ${sidebarClasses}`;

  return (
    <>
      {/* Mobile menu button - visible only on small screens */}
      <button
        className="fixed left-4 top-4 z-50 block rounded-md bg-primary-dark p-2 text-white lg:hidden"
        onClick={toggleMobileMenu}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar content */}
      <div className={mobileSidebarClasses}>
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Logo size={expanded ? 'md' : 'sm'} />
            {expanded && <span className="ml-2 text-xl font-bold">Umzima</span>}
          </div>
          <button
            onClick={toggleSidebar}
            className="hidden rounded-full p-1 text-white hover:bg-primary-secondary lg:block"
          >
            {expanded ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        <div className="mt-8 flex-1 px-2">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-md px-4 py-3 transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-bright text-primary-dark'
                    : 'text-white hover:bg-primary-secondary'
                } ${expanded ? '' : 'justify-center'}`}
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {expanded && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className={`flex ${expanded ? 'flex-row' : 'flex-col'} items-center`}>
            <div className="h-8 w-8 rounded-full bg-accent-green-1 flex items-center justify-center text-white">
              {user?.name.charAt(0)}
            </div>
            {expanded && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs capitalize text-gray-300">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;