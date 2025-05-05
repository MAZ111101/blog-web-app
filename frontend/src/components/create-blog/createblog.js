import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/check-auth');
      const data = await res.json();
      if (!data.authenticated) {
        navigate('/login');
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // Update word count as content changes
  useEffect(() => {
    setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (wordCount > 1000) {
      setMessage('Blog exceeds 1000 word limit.');
      return;
    }

    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });

      const result = await res.json();

      if (res.ok) {
        setMessage(result.message);
        setTimeout(() => navigate(`/blogs/${result.blog_id}`), 1000);
      } else {
        setMessage(result.error || 'Error creating blog');
      }
    } catch (err) {
      setMessage('Network error. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        Verifying session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-2xl p-8">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">Create a New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <textarea
              placeholder="Write your blog here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="10"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">Word count: {wordCount} / 1000</p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-red-500">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBlog;
