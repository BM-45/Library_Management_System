// SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('books');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, category);
  };

  return (
    <div className="search-bar-container">
      <div className="tabs">
        <button onClick={() => setCategory('search')}>Search</button>
        <button onClick={() => setCategory('books')}>Books</button>
        <button onClick={() => setCategory('journalTitles')}>Journal Titles</button>
        <button onClick={() => setCategory('databases')}>Databases</button>
        <button onClick={() => setCategory('researchGuides')}>Research Guides</button>
        <button onClick={() => setCategory('help')}>Help</button>
      </div>
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, articles, media and more..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
}

export default SearchBar;