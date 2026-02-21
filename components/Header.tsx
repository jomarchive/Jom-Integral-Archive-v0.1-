import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: "Today's", path: '/today' },
    { label: 'Top 10', path: '/top10' },
    { label: 'Archive', path: '/archive' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 tracking-tighter italic math-font">JIA</span>
            <span className="hidden md:block text-sm font-semibold text-gray-400 uppercase tracking-widest">Jom Integral Archive</span>
          </Link>
          <nav className="flex space-x-1 sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;