import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/check-auth');
        const data = await res.json();
        if (!data.authenticated) {
          navigate('/login');
        } else {
          setAuthChecked(true);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (authChecked) {
      const fetchMyBlogs = async () => {
        try {
          const response = await fetch('/api/myblogs');
          const data = await response.json();
          if (response.ok) {
            setBlogs(data);
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error('Error fetching blogs:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchMyBlogs();
    }
  }, [authChecked]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
        Loading your blogs...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">My Blogs</h2>

        {blogs.length === 0 ? (
          <p className="text-gray-600">You haven't written any blogs yet.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog.blog_id} className="border-b pb-4">
                <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                  <a href={`/blogs/${blog.blog_id}`}>{blog.title}</a>
                </h3>
                <p className="text-sm text-gray-700">Word Count: {blog.word_count}</p>
                <p className="text-xs text-gray-500 italic">
                  {new Date(blog.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;