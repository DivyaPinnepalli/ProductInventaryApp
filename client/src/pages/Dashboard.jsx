import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductForm from '../components/ProductForm.jsx';
import ProductList from '../components/ProductList.jsx';

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    return (
        <div>
            <header className="header">
                <h1>Inventory Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <ProductForm />
            <ProductList />
        </div>
    );
}