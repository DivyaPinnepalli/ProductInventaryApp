import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/auth/login', form);
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setForm({ email: '', password: '' });
      setRedirect(true);            // trigger the redirect below
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  // If redirect is true, render a <Navigate> to "/"
  if (redirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-card">
      <h2>Log In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} autoComplete="off">
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </label>
        <button type="submit">Log In</button>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
