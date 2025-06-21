// src/components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FavoritesContext } from '../App';

const MovieCard = ({ movie }) => {
  const { addFavorite, removeFavorite, isFavorite } = useContext(FavoritesContext);
  const favorite = isFavorite(movie.imdbID);

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  const fallbackPoster = "https://placehold.co/300x450/000000/FFFFFF?text=No+Poster";

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out flex flex-col h-full">
      <Link to={`/movie/${movie.imdbID}`}>
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : fallbackPoster}
          alt={movie.Title}
          className="w-full h-72 object-cover object-center"
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackPoster; }}
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{movie.Title}</h3>
        <p className="text-gray-400 text-sm mb-3 flex-grow">{movie.Year} | {movie.Type}</p>
        <div className="flex justify-between items-center mt-auto">
          <Link
            to={`/movie/${movie.imdbID}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out text-sm"
          >
            Details
          </Link>
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full transition duration-300 ease-in-out ${
              favorite ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <svg
              className="w-6 h-6 text-white"
              fill={favorite ? "currentColor" : "none"}
              stroke="currentColor"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;