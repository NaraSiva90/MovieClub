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

  // Expected distribution (from calibration table)
  const EXPECTED_DISTRIBUTION = {
    1: 0.40,  // 40% - Below Par
    2: 0.30,  // 30% - Average
    3: 0.20,  // 20% - Above Average
    4: 0.08,  // 8% - Superlative
    5: 0.02,  // 2% - Era-Defining
  };

  // Chi-squared CDF approximation using Wilson-Hilferty transformation
  // Returns p-value for chi-squared statistic with given degrees of freedom
  const chiSquaredPValue = useCallback((chiSquared, df) => {
    if (chiSquared <= 0) return 1;
    if (df <= 0) return 1;
    
    // Wilson-Hilferty approximation for chi-squared CDF
    const z = Math.pow(chiSquared / df, 1/3) - (1 - 2 / (9 * df));
    const denom = Math.sqrt(2 / (9 * df));
    const zScore = z / denom;
    
    // Standard normal CDF approximation
    const normalCDF = (x) => {
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;
      
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x) / Math.sqrt(2);
      
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      
      return 0.5 * (1.0 + sign * y);
    };
    
    // P-value is 1 - CDF (probability of getting this extreme or more)
    return 1 - normalCDF(zScore);
  }, []);

  // Calculate chi-squared statistic
  const calculateChiSquared = useCallback((observed, expected, total) => {
    let chiSquared = 0;
    
    for (let score = 1; score <= 5; score++) {
      const O = observed[score] || 0;
      const E = expected[score] * total;
      
      // Skip if expected is too small (chi-squared assumption)
      if (E < 1) continue;
      
      chiSquared += Math.pow(O - E, 2) / E;
    }
    
    return chiSquared;
  }, []);

  // Get calibration nudge message with chi-squared test
  const getCalibrationNudge = useCallback(() => {
    const percentages = getCalibrationPercentages();
    
    if (calibration.total < 5) {
      return { type: 'info', message: 'Keep reviewing to see your calibration stats.' };
    }
    
    // Simple threshold warnings (always apply)
    if (percentages[5] > 10) {
      return {
        type: 'warning',
        message: `Your 5s are ${percentages[5].toFixed(0)}% of scores. Era-defining should be ~2%—reserve for truly exceptional films.`,
      };
    }
    
    if (percentages[4] > 25) {
      return {
        type: 'warning',
        message: `Your 4s are ${percentages[4].toFixed(0)}% of scores. Superlative should be ~8%—the top decile.`,
      };
    }
    
    // Chi-squared test (only for 10+ scores, i.e., 2+ reviews)
    if (calibration.total >= 10) {
      const chiSquared = calculateChiSquared(calibration, EXPECTED_DISTRIBUTION, calibration.total);
      const df = 4; // 5 categories - 1
      const pValue = chiSquaredPValue(chiSquared, df);
      
      if (pValue < 0.05) {
        return {
          type: 'error',
          message: `Your rating distribution is highly unusual (p < 0.05). Consider whether you're applying the scale consistently.`,
        };
      }
      
      if (pValue < 0.10) {
        return {
          type: 'warning',
          message: `Your rating distribution is somewhat unusual (p < 0.10). Most films should be 1s and 2s.`,
        };
      }
    }
    
    return { type: 'success', message: 'Your calibration looks healthy. Keep it up!' };
  }, [calibration, getCalibrationPercentages, calculateChiSquared, chiSquaredPValue]);

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
