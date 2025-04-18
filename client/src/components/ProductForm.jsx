import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

export default function ProductForm() {
    const [barcode, setBarCode] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        barcode: '', name: '', brand: '', category: '', unit: '', mrp: 0,
        discountedPrice: 0, stock: 0, description: '', imageUrl: ''
    });
    const [editId, setEditId] = useState(null);

    // Initialize QR scanner once
    // const scanner = new Html5Qrcode('reader');
    useEffect(() => {
        const scanner = new Html5Qrcode('reader');
        scanner.start(
            { facingMode: 'environment' },
            { fps: 10, qrbox: 250 },
            code => {
                scanner.stop();
                setFormData(prev => ({ ...prev, barcode: code }));
                console.log(code);
                axios.get(`http://localhost:3000/api/products/external/${code}`)
                    .then(({ data }) => setFormData(prev => ({ ...prev, ...data })))
                    .catch(() => { });
            }
        ).catch(console.error);
    }, []);


    const handleChange = e => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        try {
            // if (editId) {
            //     await axios.put(`http://localhost:3000/api/products/${editId}`, formData);
            // } else {
            const res = await axios.post('http://localhost:3000/api/products', formData);
            // setEditId(res.data._id);
            // }
            alert('Product saved');
            setFormData({ barcode: '', name: '', brand: '', category: '', unit: '', mrp: 0, discountedPrice: 0, stock: 0, description: '', imageUrl: '' });
            setEditId(null);
        } catch {
            alert('Error saving product');
        }
    };

    const handleBarCode = () => {
        setLoading(true);
        // scanner.stop();
        axios.get(`http://localhost:3000/api/products/external/${barcode}`)
            .then(({ data }) => setFormData(prev => ({ ...prev, ...data })))
            .catch(() => { });
        setLoading(false);
    }

    return (
        <div className="container">
            <h1>Product Inventory</h1>

            <div id="reader" className="reader" />

            <div className="barcode-group">
                <input
                    onChange={e => setBarCode(e.target.value)}
                    type="text"
                    placeholder="Enter barcode"
                />
                <button onClick={handleBarCode}>Fetch</button>
            </div>

            <form  className="form">
                {Object.keys(formData).map(field => (
                    <label key={field}>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                        {field === 'description' ? (
                            <textarea id={field} value={formData[field]} onChange={handleChange} />
                        ) : (
                            <input id={field} value={formData[field]} onChange={handleChange} />
                        )}
                    </label>
                ))}
                <button onClick={handleSubmit} type="button">Save</button>
            </form>
        </div>
    )
}