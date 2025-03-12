import Register from './Pages/Register';
import { Login } from './Pages/Login';
import  Home  from './Pages/Home';
import './App.css'
import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/Profil" element={<Profil />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;
