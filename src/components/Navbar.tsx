import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Award, Home, PlusCircle, BarChart2, Settings } from 'lucide-react';
import { useRewards } from '../context/RewardContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { points } = useRewards();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Главная', icon: <Home size={20} /> },
    { path: '/add', label: 'Добавить привычку', icon: <PlusCircle size={20} /> },
    { path: '/manage', label: 'Управление привычками', icon: <Settings size={20} /> },
    { path: '/statistics', label: 'Статистика', icon: <BarChart2 size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 font-bold" onClick={closeMenu}>
            <Award size={28} className="text-blue-500" />
            <span className="text-xl">Трекер Привычек</span>
          </Link>

          {/* Награды (видны всегда) */}
          <div className="hidden md:flex items-center bg-blue-50 rounded-full px-3 py-1">
            <Award size={18} className="text-blue-500 mr-2" />
            <span className="text-blue-700 font-medium">{points} очков</span>
          </div>

          {/* Десктопное меню */}
          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                  }`}
              >
                <span className="hidden lg:block">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Мобильная кнопка меню */}
          <div className="md:hidden flex items-center">
            <div className="flex items-center mr-4 bg-blue-50 rounded-full px-3 py-1">
              <Award size={16} className="text-blue-500 mr-1" />
              <span className="text-blue-700 text-sm font-medium">{points}</span>
            </div>
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3
                ${location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              onClick={closeMenu}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;