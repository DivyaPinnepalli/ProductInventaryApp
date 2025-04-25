import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import './ProductForm.css';

export default function ProductForm({ productToEdit, onSaved }) {
  const initial = {
    barcode: '', name: '', brand: '', category: '', unit: '', mrp: 0,
    discountedPrice: 0, stock: 0, description: '', imageUrl: ''
  };
  const [formData, setFormData] = useState(initial);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
      setEditingId(productToEdit._id);
    }
  }, [productToEdit]);

  // QR code scanner setup
  useEffect(() => {
    const scanner = new Html5Qrcode('reader');
    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      code => {
        scanner.stop();
        fetchByBarcode(code);
      }
    ).catch(console.error);
  }, []);

  // Shared fetch logic
  const fetchByBarcode = async code => {
    setFormData(prev => ({ ...prev, barcode: code }));
    try {
      const { data } = await axios.get(`/api/products/external/${code}`);
      setFormData(prev => ({ ...prev, ...data }));
    } catch {
      alert('Product not found in external API');
    }
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData);
      } else {
        await axios.post('/api/products', formData);
      }
      alert('Saved!');
      setFormData(initial);
      setEditingId(null);
      onSaved();
    } catch {
      alert('Error saving product');
    }
  };

  return (
    <div className="form-card">
      <h2>{editingId ? 'Edit' : 'Add'} Product</h2>

      {/* QR Scanner */}
      <div id="reader" className="reader" />

      {/* Manual Fetch by Barcode */}
      <div className="barcode-group">
        <input
          type="text"
          id="barcode"
          value={formData.barcode}
          placeholder="Scan or enter barcode"
          onChange={e => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
        />
        <button
          type="button"
          onClick={() => fetchByBarcode(formData.barcode)}
        >
          Fetch
        </button>
      </div>

      {/* Product Form Fields */}
      <form onSubmit={handleSubmit} className="form-grid">
        {Object.keys(formData).map(key =>
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}:
            {key === 'description'
              ? <textarea id={key} value={formData[key]} onChange={handleChange} />
              : <input id={key} value={formData[key]} onChange={handleChange} />
            }
          </label>
        )}
        <button type="submit" className="save-btn">
          {editingId ? 'Update' : 'Save'}
        </button>
      </form>
    </div>
  );
}
