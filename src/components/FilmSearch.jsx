import React, { useState, useEffect, useCallback } from 'react';
import { getImageUrl } from '../hooks/useTMDB';

const FilmSearch = ({ onSelect, tmdb }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const { searchMovies, loading } = tmdb;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        const movies = await searchMovies(query);
        setResults(movies.slice(0, 8));
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchMovies]);

  const handleSelect = (movie) => {
    onSelect(movie);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for a film to review..."
          className="w-full bg-charcoal border border-slate rounded-xl px-5 py-4 text-cream placeholder-silver/50 focus:border-gold focus:outline-none transition-colors text-lg"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && query.length > 0 && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-silver hover:text-cream transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-charcoal border border-slate rounded-xl shadow-2xl overflow-hidden animate-fade-in">
          {results.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleSelect(movie)}
              className="w-full flex items-center gap-4 p-3 hover:bg-slate/50 transition-colors text-left"
            >
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, 'w92')}
                  alt={movie.title}
                  className="w-12 h-18 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-18 bg-slate rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-cream font-medium truncate">{movie.title}</p>
                <p className="text-silver text-sm">
                  {movie.release_date?.split('-')[0] || 'Unknown year'}
                </p>
              </div>
              <svg className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
};

export default FilmSearch;
