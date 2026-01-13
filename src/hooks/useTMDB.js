import { useState, useCallback } from 'react';

const API_KEY = '6e47d071b91e414b0f5040fc978f5b2e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};

// Language code to name mapping for common languages
const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu',
  ml: 'Malayalam',
  kn: 'Kannada',
  bn: 'Bengali',
  mr: 'Marathi',
  pa: 'Punjabi',
  gu: 'Gujarati',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  ru: 'Russian',
  ar: 'Arabic',
};

export const getLanguageName = (code) => {
  return LANGUAGE_NAMES[code] || code?.toUpperCase() || 'Unknown';
};

// Extract key credits from movie data
export const extractCredits = (movieData) => {
  if (!movieData?.credits) return {};
  
  const { cast = [], crew = [] } = movieData.credits;
  
  // Get director(s)
  const directors = crew
    .filter(person => person.job === 'Director')
    .map(person => person.name)
    .slice(0, 2);
  
  // Get top cast (first 3)
  const topCast = cast
    .slice(0, 3)
    .map(person => person.name);
  
  // Get composer - try multiple job titles
  const composerJobs = ['Original Music Composer', 'Music', 'Composer', 'Music Director'];
  const composers = crew
    .filter(person => composerJobs.includes(person.job) || person.department === 'Sound')
    .filter(person => person.job !== 'Sound Designer' && person.job !== 'Sound Mixer')
    .map(person => person.name)
    .filter((name, index, self) => self.indexOf(name) === index) // unique
    .slice(0, 1);
  
  return {
    directors,
    topCast,
    composers,
  };
};

export const useTMDB = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchMovies = useCallback(async (query) => {
    if (!query || query.length < 2) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
      );
      
      if (!response.ok) throw new Error('Failed to fetch movies');
      
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getMovieDetails = useCallback(async (movieId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`
      );
      
      if (!response.ok) throw new Error('Failed to fetch movie details');
      
      const data = await response.json();
      
      // Extract and attach processed credits
      const credits = extractCredits(data);
      
      return {
        ...data,
        processedCredits: credits,
        languageName: getLanguageName(data.original_language),
      };
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPopularMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch popular movies');
      
      const data = await response.json();
      return data.results || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    searchMovies,
    getMovieDetails,
    getPopularMovies,
    loading,
    error,
  };
};
