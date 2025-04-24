import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import './ProductForm.css';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    barcode: '', name: '', brand: '', category: '', unit: '', mrp: 0,
    discountedPrice: 0, stock: 0, description: '', imageUrl: ''
  });

  // Start QR scanner once
  useEffect(() => {
    const scanner = new Html5Qrcode('reader');
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      code => {
        scanner.stop();
        setFormData(prev => ({ ...prev, barcode: code }));
        axios.get(`http://localhost:3000/api/products/external/${code}`)
          .then(({ data }) => setFormData(prev => ({ ...prev, ...data })))
          .catch(() => {});
      }
    ).catch(console.error);
  }, []);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:3000/api/products', formData);
      alert('Product saved');
      setFormData({
        barcode: '', name: '', brand: '', category: '', unit: '', mrp: 0,
        discountedPrice: 0, stock: 0, description: '', imageUrl: ''
      });
    } catch {
      alert('Error saving product');
    }
  };

  return (
    <div className="form-card">
      <h2>Add / Edit Product</h2>
      <div id="reader" className="reader" />
      <div className="barcode-group">
        <input
          type="text" id="barcode" value={formData.barcode}
          placeholder="Scan or enter barcode" onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
        />
        <button onClick={() => {
          const code = formData.barcode;
          axios.get(`http://localhost:3000/api/products/external/${code}`)
            .then(({ data }) => setFormData(prev => ({ ...prev, ...data })))
            .catch(() => {});
        }}>Fetch</button>
      </div>
      <div className="form-grid">
        {Object.keys(formData).map(field => (
          field !== 'barcode' && (
            <label key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              {field === 'description'
                ? <textarea id={field} value={formData[field]} onChange={handleChange} />
                : <input id={field} value={formData[field]} onChange={handleChange} />
              }
            </label>
          )
        ))}
      </div>
      <button className="save-btn" onClick={handleSubmit}>Save Product</button>
    </div>
  );
}
