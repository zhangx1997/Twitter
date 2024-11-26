import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import UserPage from './components/UserPage';
import Register from './pages/Register'; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user/:username" element={<UserPage />} />
        <Route path="/register" element={<Register />} /> {/* Add Register route */}
      </Routes>
    </Router>
  );
}

export default App;
