Movie search App
This is a full-featured movie search application built using React, which integrates with the OMDB API. Users can search for movies, view detailed information, and manage a list of their favorite movies.

Features
Movie Search: Search for movies and series by title or keywords.

Type Filter: Filter search results by movie, series, or episode type.

Detailed View: Click on any movie to see comprehensive details including plot, cast, ratings, and much more.

Pagination: Navigate through large sets of search results.

Favorites Management: Add/remove movies to/from a persistent favorites list (stored in local storage).

Responsive Design: Optimized for various screen sizes using Tailwind CSS.

Error Handling: User-friendly messages for API errors or when no results are found.

Technologies Used
React.js

React Router

HTML/CSS and Tailwind CSS for styling

JavaScript (ES6+)

OMDB API

Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
You need to have Node.js and npm (or Yarn) installed on your machine.

Node.js (includes npm)

Installation
Clone the repository:

git clone <your-repository-url-here>
cd movie-search-app


(Replace <your-repository-url-here> with your actual repository URL if you're using Git).

Install dependencies:

npm install
# or
yarn install


Get an OMDB API Key:

Go to https://www.omdbapi.com/.

Register for a free API key.

Once you receive your API key, open src/api.js file and confirm that 'b732464' (which you provided) is used as the OMDB_API_KEY.

Run the application:

npm start
# or
yarn start


The application will open in your browser at http://localhost:3000.

Project Structure
movie-search-app/
├── public/
├── src/
│   ├── api.js                # OMDB API service functions
│   ├── App.js                # Main application component, routes, global state (FavoritesContext)
│   ├── index.css             # Tailwind CSS imports
│   ├── index.js              # React DOM rendering
│   ├── components/
│   │   ├── MovieCard.js      # Displays individual movie posters and brief info
│   │   ├── MovieDetails.js   # Displays detailed information for a single movie
│   │   ├── SearchBar.js      # Input for searching movies and type filter
│   │   └── Pagination.js     # Controls for navigating search results pages
│   └── reportWebVitals.js
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
└── ...


Contributing
Feel free to fork the repository and submit pull requests.

License
This project is open source and available under the MIT License.
