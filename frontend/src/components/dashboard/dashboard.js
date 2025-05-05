import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (!data.authenticated) {
          navigate('/login');
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'GET' });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center space-y-6">
        <h2 className="text-3xl font-bold text-blue-700">Your Dashboard</h2>
        
        <button
          onClick={() => navigate('/dashboard/create-blog')}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Create New Blog
        </button>

        <button
          onClick={() => navigate('/myblogs')}
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          My Blogs
        </button>

        <button
          onClick={() => navigate('/recentblogs')}
          className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
        >
          Recent Blogs
        </button>

        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
