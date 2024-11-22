// SearchResults.js
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const category = searchParams.get('category');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/search?query=${query}&category=${category}`);
        setResults(response.data);
        setError(null);
      } catch (err) {
        setError('An error occurred while fetching results. Please try again.');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Search Results for "{query}" in {category}</h2>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {results.map(book => (
            <li key={book.id}>
              <h3>{book.title}</h3>
              <p>By {book.author}</p>
              <p>ISBN: {book.isbn}</p>
              {book.image_url && <img src={book.image_url} alt={book.title} style={{maxWidth: '100px'}} />}
            </li>
          ))}
        </ul>
      )}
      <Link to="/">Back to Search</Link>
    </div>
  );
}

export default SearchResults;