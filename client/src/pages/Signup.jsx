import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const { data } = await axios.post('http://localhost:3000/auth/signup', form);
      // store token & optionally user info
      localStorage.setItem('token', data.token);
      setSuccess('Signup successful! You are now logged in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            name="username" value={form.username}
            onChange={handleChange} required
          />
        </label>
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

