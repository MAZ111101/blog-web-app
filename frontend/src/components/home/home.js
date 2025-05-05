import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-800">
      <header className="w-full py-6 px-4 shadow-md bg-white flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">📝 BlogPlatform</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="text-indigo-700 font-medium hover:underline"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-indigo-800 leading-tight">
          Share Ideas, Stories & Insights
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Welcome to your personal publishing platform. Read inspiring stories, write your thoughts, and connect with a community of thinkers.
        </p>

        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/searchblogs"
            className="text-indigo-700 border border-indigo-600 px-6 py-3 rounded-full text-lg font-medium hover:bg-indigo-100 transition"
          >
            Search Blogs
          </Link>
        </div>
      </main>

      <footer className="text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} BlogPlatform. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
