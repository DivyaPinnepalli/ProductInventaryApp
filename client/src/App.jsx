import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Dashboard from './pages/Dashboard.jsx';
import Login     from './pages/Login.jsx';
import Signup    from './pages/Signup.jsx';

export default function App() {
  // 1. Track login status in state
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  // 2. On mount: bootstrap axios header
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }, []);

  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Dashboard onLogout={() => setIsLoggedIn(false)} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/signup"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <Signup onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
