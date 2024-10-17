import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="flex items-center border-2 rounded-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files and folders..."
          className="flex-grow px-4 py-2 focus:outline-none"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 hover:bg-blue-600">
          <FaSearch />
        </button>
      </div>
    </form>
  );
};

export default Search;
