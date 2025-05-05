import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (res.ok) {
          setBlog(data);
          setTitle(data.title);
          setContent(data.content);
        } else {
          setError(data.error || 'Failed to load blog');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (res.ok) {
        setBlog({ ...blog, title, content });
        setIsEditing(false);
      } else {
        alert(data.error || 'Update failed');
      }
    } catch {
      alert('Network error during update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/myblogs');
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch {
      alert('Network error during deletion');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-gray-600">Loading blog...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-50 p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-3xl w-full">
        {isEditing ? (
          <>
            <input
              className="text-2xl font-bold text-indigo-700 mb-4 w-full border-b border-gray-300 p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full h-48 border border-gray-300 p-3 rounded mt-2 text-gray-700"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 flex gap-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">{blog.title}</h1>
            <p className="text-gray-700 whitespace-pre-line">{blog.content}</p>
            <p className="mt-6 text-sm text-gray-400">Blog ID: {blog.id}</p>

            <div className="mt-6 flex gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
