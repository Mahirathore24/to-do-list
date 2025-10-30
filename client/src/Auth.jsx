import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      console.log('Sending request to:', `http://localhost:5000${endpoint}`);
      console.log('Payload:', payload);

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', res.data);
      
      if (res.data.success) {
        // Store token in localStorage
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        onLogin(res.data.user, res.data.token);
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your connection.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure backend is running.');
      } else {
        setError(err.response?.data?.error || 'Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">{isLogin ? 'Welcome Back! 👋' : 'Join Us! 🎉'}</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Login to manage your tasks' : 'Create an account to get started'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? '⏳ Please wait...' : isLogin ? '🔓 Login' : '🚀 Sign Up'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ name: '', email: '', password: '' });
            }}
            className="toggle-link"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
