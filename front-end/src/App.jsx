import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import { fetchUser } from './api/auth';
import './App.css';
import Register from './Pages/Register';
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userData = await fetchUser();
      setUser({
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
      return true;
    } catch (error) {
      localStorage.removeItem('authToken');
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#600C0C]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - Home component */}
        <Route 
          path="/" 
          element={<Home />} 
        />
        <Route path="/register"
          element={<Register/>}
        />

        {/* Login route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login checkAuth={checkAuth} />}
        />
        
        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        {/* Catch-all route */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;