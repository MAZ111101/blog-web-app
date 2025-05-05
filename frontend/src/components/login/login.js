import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthRedirect from '../../hooks/useAuthRedirect';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  useAuthRedirect(true);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setMessage(result.message || result.error || 'Unexpected error');

      if (result.message) {
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-cyan-100">
      <div className="absolute top-4 right-4">
        <Link
          to="/"
          className="text-purple-600 hover:text-purple-800 text-lg font-semibold"
          >
            Home
        </Link>
      </div>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-red-600">
            {message}
          </div>
        )}

        <p className="mt-6 text-center">
          <Link to="/searchblogs" className="text-blue-500 hover:underline">
            Search Blogs
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
