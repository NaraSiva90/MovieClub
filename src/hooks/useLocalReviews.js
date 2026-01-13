import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'movieclub_reviews';
const CALIBRATION_KEY = 'movieclub_calibration';

export const useLocalReviews = () => {
  const [reviews, setReviews] = useState({});
  const [calibration, setCalibration] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    total: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setReviews(JSON.parse(stored));
      }
      
      const storedCalibration = localStorage.getItem(CALIBRATION_KEY);
      if (storedCalibration) {
        setCalibration(JSON.parse(storedCalibration));
      }
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
    }
  }, []);

  // Recalculate calibration from reviews
  const recalculateCalibration = useCallback((reviewsObj) => {
    const newCalibration = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: 0 };
    
    Object.values(reviewsObj).forEach(review => {
      Object.values(review.scores).forEach(score => {
        newCalibration[score]++;
        newCalibration.total++;
      });
    });
    
    return newCalibration;
  }, []);

  // Save review
  const saveReview = useCallback((movieId, movieData, scores, text = '') => {
    const newReviews = {
      ...reviews,
      [movieId]: {
        movieId,
        movieData,
        scores,
        text,
        createdAt: new Date().toISOString(),
      },
    };
    
    setReviews(newReviews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    
    const newCalibration = recalculateCalibration(newReviews);
    setCalibration(newCalibration);
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(newCalibration));
    
    return newReviews[movieId];
  }, [reviews, recalculateCalibration]);

  // Get review for a specific movie
  const getReview = useCallback((movieId) => {
    return reviews[movieId] || null;
  }, [reviews]);

  // Get all reviews
  const getAllReviews = useCallback(() => {
    return Object.values(reviews).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reviews]);

  // Delete review
  const deleteReview = useCallback((movieId) => {
    const newReviews = { ...reviews };
    delete newReviews[movieId];
    
    setReviews(newReviews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    
    const newCalibration = recalculateCalibration(newReviews);
    setCalibration(newCalibration);
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(newCalibration));
  }, [reviews, recalculateCalibration]);

  // Get calibration percentages
  const getCalibrationPercentages = useCallback(() => {
    if (calibration.total === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    return {
      1: (calibration[1] / calibration.total) * 100,
      2: (calibration[2] / calibration.total) * 100,
      3: (calibration[3] / calibration.total) * 100,
      4: (calibration[4] / calibration.total) * 100,
      5: (calibration[5] / calibration.total) * 100,
    };
  }, [calibration]);

  // Get calibration nudge message
  const getCalibrationNudge = useCallback(() => {
    const percentages = getCalibrationPercentages();
    const nudges = [];
    
    // Target ranges
    const targets = {
      1: { min: 10, max: 20, name: '1s (Below Par)' },
      2: { min: 35, max: 50, name: '2s (Average)' },
      3: { min: 20, max: 35, name: '3s (Above Average)' },
      4: { min: 5, max: 15, name: '4s (Superlative)' },
      5: { min: 0, max: 5, name: '5s (Era-Defining)' },
    };
    
    if (calibration.total < 5) {
      return { type: 'info', message: 'Keep reviewing to see your calibration stats.' };
    }
    
    // Check for issues
    if (percentages[5] > 10) {
      nudges.push({
        type: 'warning',
        message: `Your 5s are ${percentages[5].toFixed(0)}% of scores. Era-defining means 1-2 films per decade—aim for under 5%.`,
      });
    }
    
    if (percentages[4] > 20) {
      nudges.push({
        type: 'warning',
        message: `Your 4s are ${percentages[4].toFixed(0)}% of scores. Superlative is top decile—aim for 5-15%.`,
      });
    }
    
    if (percentages[2] < 25) {
      nudges.push({
        type: 'info',
        message: `Your 2s are only ${percentages[2].toFixed(0)}%. Most films are average—2s should be 35-50%.`,
      });
    }
    
    if (nudges.length === 0) {
      return { type: 'success', message: 'Your calibration looks healthy. Keep it up!' };
    }
    
    return nudges[0];
  }, [calibration, getCalibrationPercentages]);

  // Load seed data
  const loadSeedData = useCallback((seedReviews) => {
    const newReviews = { ...reviews };
    
    Object.values(seedReviews).forEach(review => {
      if (!newReviews[review.movieId]) {
        newReviews[review.movieId] = review;
      }
    });
    
    setReviews(newReviews);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    
    const newCalibration = recalculateCalibration(newReviews);
    setCalibration(newCalibration);
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(newCalibration));
  }, [reviews, recalculateCalibration]);

  return {
    reviews,
    calibration,
    saveReview,
    getReview,
    getAllReviews,
    deleteReview,
    getCalibrationPercentages,
    getCalibrationNudge,
    loadSeedData,
  };
};
