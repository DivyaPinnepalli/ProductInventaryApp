import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('http://localhost:3000/auth/login', form);
      localStorage.setItem('token', data.token);
      // Notify parent that login succeeded
      onLogin && onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="auth-card">
      <h2>Log In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email" name="email" value={form.email}
            onChange={handleChange} required
          />
        </label>
        <label>
          Password
          <input
            type="password" name="password" value={form.password}
            onChange={handleChange} required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
