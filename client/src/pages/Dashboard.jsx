import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ProductForm from '../components/ProductForm.jsx';
import ProductList from '../components/ProductList.jsx';

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [productToEdit, setProductToEdit] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <header className="header">
        <h1>Inventory Dashboard</h1>
        <button
          style={{
            padding: "0.4rem 0.8rem",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.9rem",
            cursor: "pointer",
            backgroundColor: "red",
            color: "white",
            transition: "background 0.2s ease"
          }}
          onClick={handleLogout}
        >
          Logout
        </button>

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
