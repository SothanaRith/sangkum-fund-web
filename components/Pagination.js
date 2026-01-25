import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange, hasNext, hasPrevious }) {
  const pages = [];
  const maxVisiblePages = 5;
  
  // Calculate which pages to show
  let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
  
  // Adjust start if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(0, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          hasPrevious
            ? 'bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-50'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
        }`}
      >
        ← Previous
      </button>

      {/* First page if not visible */}
      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="px-4 py-2 rounded-lg font-semibold bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-all"
          >
            1
          </button>
          {startPage > 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            page === currentPage
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
              : 'bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* Last page if not visible */}
      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="px-4 py-2 rounded-lg font-semibold bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 transition-all"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
          hasNext
            ? 'bg-white text-orange-600 border-2 border-orange-600 hover:bg-orange-50'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
        }`}
      >
        Next →
      </button>
    </div>
  );
}
