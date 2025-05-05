import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SearchBlogs = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    if (!query.trim()) {
      setError('Please enter a blog title');
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/blogs/search?title=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok) {
        setResults(data);
      } else {
        setError(data.error || 'No blogs found');
      }
    } catch (err) {
      setError('An error occurred while searching');
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center px-4 py-10">
        <div className='absolute top-4 right-4'>
            <Link
            to="/"
            className="text-purple-600 hover:text-purple-800 text-lg font-semibold"
            >
                Home
            </Link>
        </div>
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-xl p-8">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Search Blogs by Title</h2>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Enter blog title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center font-medium mb-4">{error}</p>
        )}

        <div className="space-y-6">
          {results.map((blog) => (
            <div key={blog.blog_id} className="border-b pb-4">
              <h3
                className="text-xl font-semibold text-blue-700 hover:underline cursor-pointer"
                onClick={() => navigate(`/blogs/${blog.blog_id}`)}
              >
                {blog.title}
              </h3>
              <p className="text-gray-700">Word Count: {blog.word_count}</p>
              <p className="text-sm text-gray-500">
                {new Date(blog.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBlogs;
