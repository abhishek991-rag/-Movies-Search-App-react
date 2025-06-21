// src/components/MovieDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails } from '../api';
import { FavoritesContext } from '../App'; 

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const favorite = movie ? isFavorite(movie.imdbID) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(imdbID);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [imdbID]);

  const handleFavoriteToggle = () => {
    if (movie) {
      if (favorite) {
        removeFavorite(movie.imdbID);
      } else {
        addFavorite(movie);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-2xl">
        Loading movie details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-red-500 text-xl p-4 text-center">
        Error: {error}
        <Link to="/" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out">
          Go back to search
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-gray-400 text-xl p-4 text-center">
        Movie not found.
        <Link to="/" className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out">
          Go back to search
        </Link>
      </div>
    );
  }

  const fallbackPoster = "https://placehold.co/400x600/000000/FFFFFF?text=No+Poster";

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster}
            alt={movie.Title}
            className="w-full h-auto rounded-lg shadow-md object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackPoster; }}
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">{movie.Title}</h1>
          <p className="text-gray-300 text-lg mb-2"><strong>Year:</strong> {movie.Year}</p>
          <p className="text-gray-300 text-lg mb-2"><strong>Genre:</strong> {movie.Genre}</p>
          <p className="text-gray-300 text-lg mb-2"><strong>Director:</strong> {movie.Director}</p>
          <p className="text-gray-300 text-lg mb-2"><strong>Actors:</strong> {movie.Actors}</p>
          <p className="text-gray-300 text-lg mb-2"><strong>Plot:</strong> {movie.Plot}</p>
          <p className="text-gray-300 text-lg mb-2"><strong>Awards:</strong> {movie.Awards}</p>

          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-3 text-blue-300">Ratings:</h2>
            {movie.Ratings && movie.Ratings.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {movie.Ratings.map((rating, index) => (
                  <li key={index} className="text-gray-400">
                    <strong>{rating.Source}:</strong> {rating.Value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No ratings available.</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleFavoriteToggle}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition duration-300 ease-in-out shadow-md ${
                favorite ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 22.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              {favorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>
            <Link
              to="/"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 ease-in-out shadow-md flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;