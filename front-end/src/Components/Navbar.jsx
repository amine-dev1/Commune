import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Menu, X, Users, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: 'Communauté', icon: <Users className="h-5 w-5" />, path: '/community' },
  ];

  const authItems = [
    { name: 'Connexion', icon: <LogIn className="h-5 w-5" />, path: '/login' },
    { name: "S'inscrire", icon: <UserPlus className="h-5 w-5" />, path: '/register' },
  ];

  return (
    <nav className="bg-[#600C0C] shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center transform hover:scale-105 transition-transform duration-200">
              <Home className="h-6 w-6 text-white" />
              <span className="ml-2 text-xl font-bold text-white">CommuneHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {/* Main Nav Items */}
            <div className="flex items-center space-x-6 mr-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-1 text-white hover:text-gray-200 transform hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <span className="group-hover:rotate-6 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Auth Items */}
            <div className="flex items-center space-x-4">
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-1 px-4 py-2 rounded-lg
                    transition-all duration-200 transform hover:scale-105
                    ${item.name === "S'inscrire"
                      ? 'bg-white text-[#600C0C] hover:bg-gray-100'
                      : 'text-white hover:bg-[#500A0A]'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none transform hover:rotate-180 transition-transform duration-300"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#600C0C] border-t border-[#800F0F]">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 text-white hover:bg-[#500A0A] px-3 py-2 rounded-md transition-all duration-200 group"
                >
                  <span className="group-hover:rotate-6 transition-transform duration-200">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="border-t border-[#800F0F] my-2"></div>
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md
                    transition-all duration-200
                    ${item.name === "S'inscrire"
                      ? 'bg-white text-[#600C0C] hover:bg-gray-100'
                      : 'text-white hover:bg-[#500A0A]'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;