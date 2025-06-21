// src/api.js

//OMDB API key. Obtained from https://www.omdbapi.com/।
const OMDB_API_KEY = 'b732464';
const OMDB_BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

// Function to search for movies
export const searchMovies = async (query, type = 'all', page = 1) => {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_OMDB_API_KEY') {
    throw new Error("The OMDB API key is missing or invalid. Please replace 'YOUR_OMDB_API_KEY' in the code with your actual OMDB API key.");
  }
  let url = `${OMDB_BASE_URL}&s=${encodeURIComponent(query)}&page=${page}`;
  if (type && type !== 'all') { // Add type filter only if it's not 'all'
    url += `&type=${encodeURIComponent(type)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.Response === "False") {
      throw new Error(data.Error);
    }
    return data;
  } catch (error) {
    console.error("Error searching for movies:", error);
    throw error;
  }
};

// Function to get movie details by IMDb ID
export const getMovieDetails = async (imdbID) => {
  if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_OMDB_API_KEY') {
    throw new Error("The OMDB API key is missing or invalid. Please replace 'YOUR_OMDB_API_KEY' in the code with your actual OMDB API key.");
  }
  const url = `${OMDB_BASE_URL}&i=${encodeURIComponent(imdbID)}&plot=full`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.Response === "False") {
      throw new Error(data.Error);
    }
    return data;
  } catch (error) {
    console.error("error to fetch movie details", error);
    throw error;
  }
};