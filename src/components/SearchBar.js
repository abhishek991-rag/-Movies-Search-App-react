// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, initialQuery = '', initialType = 'all' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, type);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-800 rounded-lg shadow-lg items-center justify-center w-full max-w-4xl mx-auto mb-8">
      <input
        type="text"
        placeholder="Search for movies, series..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
      >
        <option value="all">All Types</option>
        <option value="movie">Movie</option>
        <option value="series">Series</option>
        <option value="episode">Episode</option>
      </select>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md w-full sm:w-auto"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;