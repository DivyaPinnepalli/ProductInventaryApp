import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.css';

export default function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(({ data }) => setProducts(data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      {products && products.map(p => (
        <div key={p._id} className="card">
          <img src={p.imageUrl} alt={p.name} />
          <h3>{p.name}</h3>
          <p><strong>Brand:</strong> {p.brand}</p>
          <p><strong>Category:</strong> {p.category.join(', ')}</p>
          <p><strong>MRP:</strong> ₹{p.mrp}</p>
          <p><strong>Discount:</strong> ₹{p.discountedPrice}</p>
          <p><strong>Stock:</strong> {p.stock}</p>
          <div className="card-actions">
            <button onClick={() => onEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
