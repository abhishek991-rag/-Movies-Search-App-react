// src/components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalResults, onPageChange, moviesPerPage = 10 }) => {
  const totalPages = Math.ceil(totalResults / moviesPerPage);

  if (totalPages <= 1) return null; // Only show pagination if there's more than one page

  const pages = [];
  const maxPagesToShow = 5; // Maximum number of page buttons to display

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8 p-4 bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-300 ease-in-out"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md transition duration-300 ease-in-out ${
            currentPage === page
              ? 'bg-blue-800 text-white font-bold'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition duration-300 ease-in-out"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;