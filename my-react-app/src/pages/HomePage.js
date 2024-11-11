import React, { useState } from 'react';
import Footer from '../components/Layout/Footer';
import NavBar from '../components/Layout/NavBar';
import SearchBar from '../components/SearchBar';
import LibraryInfo from '../components/LibraryInfo';
import './HomePage.css';
//import axios from 'axios';

/*
function HomePage() {

  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const data = await response.json();
    setBooks(data.items || []);
  };




  return (
    <div>
      <NavBar />

      
      
    <div className="main-content">
    <div className="book-search">
      <h1>Book Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <img 
              src={book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'} 
              alt={book.volumeInfo.title}
            />
            <h3>{book.volumeInfo.title}</h3>
            <p>{book.volumeInfo.authors?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
    </div>

      

      <Footer/>
    </div>
  );
}
*/

function HomePage() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query, category) => {
    console.log(`Searching for ${query} in category ${category}`);
    // Implement your search logic here
    // Update searchResults state with the results
    setSearchResults([]); // Placeholder for actual results
  };

  return (
    <div>
      <NavBar />
    <div className="home-page">
        <SearchBar onSearch={handleSearch} />
        <div className="search-results">
          {/* Display search results here */}
        </div>
        <LibraryInfo />
    </div>

    <Footer/>
    </div>
  );
}

export default HomePage;