import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('/api/blogs/recentblogs');
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-200 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Recent Blogs</h1>

        {loading && (
          <div className="text-center text-gray-500">Loading recent blogs...</div>
        )}

        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className="text-center text-gray-500">No recent blogs found.</div>
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog.blog_id}
                className="border-b border-gray-300 pb-4"
              >
                <h3 className="text-xl font-semibold text-blue-800 hover:underline cursor-pointer"
                    onClick={() => navigate(`/blogs/${blog.blog_id}`)}
                >
                  {blog.title}
                </h3>
                <small className="text-gray-600">
                  Created: {new Date(blog.created_at).toLocaleString()} | Word Count: {blog.word_count}
                </small>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentBlogs;