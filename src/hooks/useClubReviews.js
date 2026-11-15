import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useClubReviews = () => {
  const [loading, setLoading] = useState(false);

  // Fetch all reviews from club members for films reviewed by 2+ members
  const getSharedFilms = useCallback(async (members) => {
    if (!members || members.length < 2) return [];

    setLoading(true);
    const memberIds = members.map(m => m.user_id);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .in('user_id', memberIds);

    if (error) {
      console.error('Failed to fetch club reviews:', error);
      setLoading(false);
      return [];
    }

    // Group reviews by movie_id
    const byMovie = {};
    data.forEach(review => {
      if (!byMovie[review.movie_id]) {
        byMovie[review.movie_id] = {
          movieId: review.movie_id,
          movieData: review.movie_data,
          reviews: [],
        };
      }
      byMovie[review.movie_id].reviews.push({
        userId: review.user_id,
        scores: review.scores,
        text: review.text || '',
        createdAt: review.created_at,
      });
    });

    // Filter to films with 2+ reviews and sort by most reviewers
    const sharedFilms = Object.values(byMovie)
      .filter(film => film.reviews.length >= 2)
      .sort((a, b) => b.reviews.length - a.reviews.length);

    setLoading(false);
    return sharedFilms;
  }, []);

  // Get all reviews for a specific film from club members
  const getFilmComparison = useCallback(async (movieId, members) => {
    if (!members || members.length === 0) return [];

    const memberIds = members.map(m => m.user_id);

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', String(movieId))
      .in('user_id', memberIds);

    if (error) {
      console.error('Failed to fetch film comparison:', error);
      return [];
    }

    return data.map(review => ({
      userId: review.user_id,
      movieData: review.movie_data,
      scores: review.scores,
      text: review.text || '',
      createdAt: review.created_at,
    }));
  }, []);

  return {
    loading,
    getSharedFilms,
    getFilmComparison,
  };
};
