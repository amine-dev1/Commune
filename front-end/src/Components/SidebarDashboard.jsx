import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, Settings, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Tableau de bord', icon: Home, path: '/dashboard' },
    { name: 'Réclamations', icon: FileText, path: '/reclamations' },
    { name: 'Communauté', icon: Users, path: '/community' },
    { name: 'Paramètres', icon: Settings, path: '/settings' },
    { name: 'Aide', icon: HelpCircle, path: '/help' },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-[#600C0C]">CommuneHub</h2>
        <p className="text-sm text-gray-500">Gestion Municipale</p>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-[#600C0C]/10 hover:text-[#600C0C] transition-colors ${
              location.pathname === item.path 
                ? 'bg-[#600C0C]/10 text-[#600C0C] font-semibold' 
                : 'hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </Link>
        ))}
      </nav>
      
      {/* Optional: Footer or Additional Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">© 2024 CommuneHub</p>
      </div>
    </div>
  );
};

export default Sidebar;