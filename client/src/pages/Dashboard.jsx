import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'

import ProductForm from '../components/ProductForm.jsx';
import ProductList from '../components/ProductList.jsx';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [productToEdit, setProductToEdit] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const username = localStorage.getItem('username') || 'Unknown';
  const email    = localStorage.getItem('email')    || 'unknown@example.com';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    delete axios.defaults.headers.common['Authorization'];
    onLogout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  return (
    <>
      <header className="header">
        <h1>Inventory Dashboard</h1>

        <div className="profile-container">
          <img
            src="data:image/png;base64,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"
            alt="Profile"
            className="profile-img"
            onClick={toggleDropdown}
          />

          {showDropdown && (
            <div className="profile-dropdown">
              <p><strong>{username}</strong></p>
              <p>{email}</p>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <ProductForm
        productToEdit={productToEdit}
        onSaved={() => setProductToEdit(null)}
      />

      <ProductList
        onEdit={p => setProductToEdit(p)}
      />
    </>
  );
}
