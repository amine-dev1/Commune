import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../api/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Redirect to login if no user data exists
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    const response = logout ; 
    navigate('/login');
  };

  if (!user) return null; // Prevent brief flash of dashboard before redirect

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-[#600C0C] px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              Tableau de bord 👋
            </h2>
          </div>

          {/* User Info */}
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Bienvenue, {user.name}!
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {/* Add more user fields as needed */}
              <p className="text-gray-600">
                <span className="font-medium">Role:</span> {user.role}
              </p>
            </div>

            {/* Dashboard Content */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                Statistiques
              </h4>
              {/* Add your dashboard metrics/components here */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Projects</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Completed Tasks</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full mt-8 bg-[#600C0C] text-white py-2 px-4 rounded-lg hover:bg-[#500A0A] transition-colors duration-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;