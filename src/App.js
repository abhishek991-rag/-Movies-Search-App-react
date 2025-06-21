import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import { searchMovies } from './api';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetails from './components/MovieDetails';
import Pagination from './components/Pagination';

// --- Global Context for Favorites Management ---
export const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const localFavorites = localStorage.getItem('omdb_favorites');
      return localFavorites ? JSON.parse(localFavorites) : [];
    } catch (error) {
      console.error("Failed to parse favorites from localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('omdb_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }, [favorites]);

  const addFavorite = useCallback((movie) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.some((fav) => fav.imdbID === movie.imdbID)) {
        return [...prevFavorites, movie];
      }
      return prevFavorites;
    });
  }, []);

  const removeFavorite = useCallback((imdbID) => {
    setFavorites((prevFavorites) => prevFavorites.filter((movie) => movie.imdbID !== imdbID));
  }, []);

  const isFavorite = useCallback((imdbID) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// --- Home Page Component (for search results) ---
const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const navigate = useNavigate();

  // handleSearch function is wrapped in useCallback to prevent unnecessary re-creations
  // This makes it safe to include in useEffect's dependency array.
  const handleSearch = useCallback(async (searchQuery, searchType, pageNumber = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setMovies([]); // Clear previous results
    setTotalResults(0); // Reset total results

    try {
      const data = await searchMovies(searchQuery, searchType, pageNumber);
      setMovies(data.Search || []); // Ensure it's an array, even if empty
      setTotalResults(parseInt(data.totalResults) || 0);
      setQuery(searchQuery); // Update query state to reflect the search
      setType(searchType); // Update type state to reflect the search
      setCurrentPage(pageNumber); // Update current page state
    } catch (err) {
      setError(err.message);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means handleSearch is stable

  // Load search parameters from URL on initial render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get('q') || '';
    const initialType = params.get('type') || 'all';
    const initialPage = parseInt(params.get('page')) || 1;

    setQuery(initialQ);
    setType(initialType);
    setCurrentPage(initialPage);

    if (initialQ) {
      handleSearch(initialQ, initialType, initialPage);
    }
  }, [handleSearch]); // FIX: Added handleSearch to dependency array

  // Update URL parameters whenever query, type, or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type && type !== 'all') params.set('type', type);
    if (currentPage > 1) params.set('page', currentPage.toString());
    navigate(`/?${params.toString()}`, { replace: true });
  }, [query, type, currentPage, navigate]); // Depend on query, type, currentPage, and navigate

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    handleSearch(query, type, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  }, [query, type, handleSearch]); // Depend on query, type, and handleSearch

  const handleSearchBarSearch = useCallback((newQuery, newType) => {
    setCurrentPage(1); // Reset page to 1 for new searches
    handleSearch(newQuery, newType, 1);
  }, [handleSearch]); // Depend on handleSearch


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
      <h1 className="text-5xl font-extrabold text-blue-500 mb-8 mt-4 text-center">
        MovieVerse
      </h1>
      <SearchBar onSearch={handleSearchBarSearch} initialQuery={query} initialType={type} />

      {loading && (
        <div className="text-2xl text-blue-400 mt-8">Loading movies...</div>
      )}

      {error && (
        <div className="text-red-500 text-center text-xl mt-8 p-4 bg-red-900 bg-opacity-30 rounded-lg max-w-xl">
          Error: {error}. Please try another search or check your API key.
        </div>
      )}

      {!loading && !error && movies.length === 0 && query.trim() !== '' && (
        <div className="text-gray-400 text-xl mt-8">No movies found for "{query}". Try a different title.</div>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 w-full max-w-6xl">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalResults={totalResults}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!loading && !error && query.trim() === '' && (
        <div className="text-gray-400 text-xl mt-8">Start by searching for a movie or series!</div>
      )}
    </div>
  );
};


// --- Favorites Page Component ---
const FavoritesPage = () => {
  const { favorites } = useContext(FavoritesContext);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-4xl font-extrabold text-blue-500 mb-8 text-center">My Favorites</h1>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mb-6 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out shadow-md"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Search
        </Link>
        {favorites.length === 0 ? (
          <p className="text-gray-400 text-xl text-center">You haven't added any favorites yet!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {
  return (
    <Router>
      <FavoritesProvider>
        {/* Navigation Header */}
        <header className="bg-gray-800 p-4 shadow-lg sticky top-0 z-10">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <Link to="/" className="text-white text-2xl font-bold hover:text-blue-400 transition duration-300">
              Movie Search App
            </Link>
            <div>
              <Link
                to="/favorites"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-md"
              >
                My Favorites
              </Link>
            </div>
          </nav>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </FavoritesProvider>
    </Router>
  );
}

export default App;