import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Dynamically choose endpoint based on state
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const response = await API.post(endpoint, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        (isLogin ? 'Login failed. Please try again.' : 'Registration failed.')
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button 
          type="button" 
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary)', 
            cursor: 'pointer', 
            padding: 0, 
            font: 'inherit', 
            fontWeight: '500',
            textDecoration: 'underline' 
          }}
        >
          {isLogin ? 'Register here' : 'Log in here'}
        </button>
      </p>
    </div>
  );
};

export default Auth;