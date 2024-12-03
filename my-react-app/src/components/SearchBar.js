// SearchBar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('books');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}&category=${category}`);
  };

  return (
    <div className="search-bar-container">
      <div className="tabs">
        <button 
          onClick={() => setCategory('books')}
          className={category === 'books' ? 'active' : ''}
        >
          Books
        </button>
        <button 
          onClick={() => setCategory('journalTitles')}
          className={category === 'journalTitles' ? 'active' : ''}
        >
          Journal Titles
        </button>
        <button 
          onClick={() => setCategory('databases')}
          className={category === 'databases' ? 'active' : ''}
        >
          Databases
        </button>
        <button 
          onClick={() => setCategory('researchGuides')}
          className={category === 'researchGuides' ? 'active' : ''}
        >
          Research Guides
        </button>
        <button 
          onClick={() => setCategory('help')}
          className={category === 'help' ? 'active' : ''}
        >
          Help
        </button>
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