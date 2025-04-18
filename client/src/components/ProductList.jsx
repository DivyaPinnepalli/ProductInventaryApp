import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ProductList.css'

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/products/getAllProducts');
      console.log(data);
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list">
      {products.length === 0
        ? <p>No products found.</p>
        : products.map(p => (
          <div className="card" key={p._id}>
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p><strong>Brand:</strong> {p.brand}</p>
            <p><strong>Category:</strong> {p.category}</p>
            <p><strong>MRP:</strong> ₹{p.mrp}</p>
            <p><strong>Discount:</strong> ₹{p.discountedPrice}</p>
            <p><strong>Stock:</strong> {p.stock}</p>
            {/* {onEdit && <button onClick={() => onEdit(p)}>Edit</button>} */}
          </div>
        ))
      }
    </div>
  );
}