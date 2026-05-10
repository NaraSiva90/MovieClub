import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseReviews = (userId) => {
  const [reviews, setReviews] = useState({});
  const [calibration, setCalibration] = useState({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!userId) return;

    const migrateLocalStorage = async (existingReviews) => {
      const STORAGE_KEY = 'movieclub_reviews';
      const CALIBRATION_KEY = 'movieclub_calibration';

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return existingReviews;

        const localReviews = JSON.parse(stored);
        const toMigrate = Object.values(localReviews).filter(
          review => !existingReviews[review.movieId]
        );

        if (toMigrate.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(CALIBRATION_KEY);
          return existingReviews;
        }

        const rows = toMigrate.map(review => ({
          user_id: userId,
          movie_id: String(review.movieId),
          movie_data: review.movieData,
          scores: review.scores,
          text: review.text || '',
        }));

        const { error } = await supabase.from('reviews').insert(rows);
        if (error) {
          console.error('Failed to migrate localStorage reviews:', error);
          return existingReviews;
        }

        const merged = { ...existingReviews };
        toMigrate.forEach(review => {
          merged[review.movieId] = review;
        });

        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CALIBRATION_KEY);
        console.log(`Migrated ${toMigrate.length} reviews from localStorage to Supabase`);
        return merged;
      } catch (err) {
        console.error('localStorage migration error:', err);
        return existingReviews;
      }
    };

    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch reviews:', error);
        setLoading(false);
        return;
      }

      let reviewsObj = {};
      data.forEach(row => {
        reviewsObj[row.movie_id] = {
          movieId: row.movie_id,
          movieData: row.movie_data,
          scores: row.scores,
          text: row.text || '',
          createdAt: row.created_at,
        };
      });

      reviewsObj = await migrateLocalStorage(reviewsObj);

      setReviews(reviewsObj);
      setCalibration(recalculateCalibration(reviewsObj));
      setLoading(false);
    };

    fetchReviews();
  }, [userId, recalculateCalibration]);

  const saveReview = useCallback(async (movieId, movieData, scores, text = '') => {
    const row = {
      user_id: userId,
      movie_id: String(movieId),
      movie_data: movieData,
      scores,
      text,
    };

    const { error } = await supabase
      .from('reviews')
      .upsert(row, { onConflict: 'user_id,movie_id' });

    if (error) {
      console.error('Failed to save review:', error);
      return null;
    }

    const newReviews = {
      ...reviews,
      [movieId]: {
        movieId,
        movieData,
        scores,
        text,
        createdAt: reviews[movieId]?.createdAt || new Date().toISOString(),
      },
    };

    setReviews(newReviews);
    setCalibration(recalculateCalibration(newReviews));
    return newReviews[movieId];
  }, [userId, reviews, recalculateCalibration]);

  const getReview = useCallback((movieId) => {
    return reviews[movieId] || null;
  }, [reviews]);

  const getAllReviews = useCallback(() => {
    return Object.values(reviews).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reviews]);

  const deleteReview = useCallback(async (movieId) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', String(movieId));

    if (error) {
      console.error('Failed to delete review:', error);
      return;
    }

    const newReviews = { ...reviews };
    delete newReviews[movieId];
    setReviews(newReviews);
    setCalibration(recalculateCalibration(newReviews));
  }, [userId, reviews, recalculateCalibration]);

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

  const EXPECTED_DISTRIBUTION = {
    1: 0.40,
    2: 0.30,
    3: 0.20,
    4: 0.08,
    5: 0.02,
  };

  const chiSquaredPValue = useCallback((chiSquared, df) => {
    if (chiSquared <= 0) return 1;
    if (df <= 0) return 1;

    const z = Math.pow(chiSquared / df, 1/3) - (1 - 2 / (9 * df));
    const denom = Math.sqrt(2 / (9 * df));
    const zScore = z / denom;

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

    return 1 - normalCDF(zScore);
  }, []);

  const calculateChiSquared = useCallback((observed, expected, total) => {
    let chiSquared = 0;
    for (let score = 1; score <= 5; score++) {
      const O = observed[score] || 0;
      const E = expected[score] * total;
      if (E < 1) continue;
      chiSquared += Math.pow(O - E, 2) / E;
    }
    return chiSquared;
  }, []);

  const getCalibrationNudge = useCallback(() => {
    const percentages = getCalibrationPercentages();

    if (calibration.total < 5) {
      return { type: 'info', message: 'Keep reviewing to see your calibration stats.' };
    }

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

    if (calibration.total >= 10) {
      const chiSquared = calculateChiSquared(calibration, EXPECTED_DISTRIBUTION, calibration.total);
      const df = 4;
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

  const loadSeedData = useCallback(async (seedReviews) => {
    const rows = Object.values(seedReviews)
      .filter(review => !reviews[review.movieId])
      .map(review => ({
        user_id: userId,
        movie_id: String(review.movieId),
        movie_data: review.movieData,
        scores: review.scores,
        text: review.text || '',
      }));

    if (rows.length === 0) return;

    const { error } = await supabase.from('reviews').insert(rows);

    if (error) {
      console.error('Failed to load seed data:', error);
      return;
    }

    const newReviews = { ...reviews };
    Object.values(seedReviews).forEach(review => {
      if (!newReviews[review.movieId]) {
        newReviews[review.movieId] = review;
      }
    });

    setReviews(newReviews);
    setCalibration(recalculateCalibration(newReviews));
  }, [userId, reviews, recalculateCalibration]);

  const calculateMode = useCallback((scores) => {
    if (scores.length === 0) return null;
    const frequency = {};
    scores.forEach(score => {
      frequency[score] = (frequency[score] || 0) + 1;
    });
    let maxFreq = 0;
    let mode = null;
    Object.entries(frequency).forEach(([score, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = parseInt(score);
      }
    });
    return mode;
  }, []);

  const calculateSpaceModes = useCallback((reviewsList) => {
    if (reviewsList.length === 0) return null;
    const dimensions = ['S', 'P', 'A', 'C', 'E'];
    const modes = {};
    dimensions.forEach(dim => {
      const scores = reviewsList.map(r => r.scores[dim]).filter(s => s != null);
      modes[dim] = calculateMode(scores);
    });
    if (Object.values(modes).some(m => m === null)) return null;
    return modes;
  }, [calculateMode]);

  const getFilteredReviews = useCallback((language, genres) => {
    const allReviews = Object.values(reviews);
    return allReviews.filter(review => {
      const movieData = review.movieData;
      const langMatch = !language || movieData.original_language === language;
      const movieGenres = movieData.genres?.map(g => g.id) || [];
      const genreMatch = !genres || genres.length === 0 ||
        genres.some(gId => movieGenres.includes(gId));
      return langMatch && genreMatch;
    });
  }, [reviews]);

  const getBenchmarkModes = useCallback((movieData) => {
    const MIN_SAMPLES = 3;
    const allReviews = Object.values(reviews);

    const overallMode = allReviews.length >= MIN_SAMPLES
      ? calculateSpaceModes(allReviews)
      : null;

    const language = movieData?.original_language;
    const genres = movieData?.genres?.map(g => g.id) || [];
    const genreNames = movieData?.genres?.map(g => g.name) || [];

    let genreMode = null;
    let genreModeLabel = null;

    if (language && genres.length > 0) {
      const langGenreReviews = getFilteredReviews(language, [genres[0]]);
      if (langGenreReviews.length >= MIN_SAMPLES) {
        genreMode = calculateSpaceModes(langGenreReviews);
        const langName = movieData.languageName || language.toUpperCase();
        genreModeLabel = `${langName} ${genreNames[0]}`;
      }
    }

    if (!genreMode && language) {
      const langReviews = getFilteredReviews(language, null);
      if (langReviews.length >= MIN_SAMPLES) {
        genreMode = calculateSpaceModes(langReviews);
        genreModeLabel = movieData.languageName || language.toUpperCase();
      }
    }

    if (!genreMode && genres.length > 0) {
      const genreReviews = getFilteredReviews(null, [genres[0]]);
      if (genreReviews.length >= MIN_SAMPLES) {
        genreMode = calculateSpaceModes(genreReviews);
        genreModeLabel = genreNames[0];
      }
    }

    return {
      genreMode,
      genreModeLabel,
      overallMode,
      overallCount: allReviews.length,
    };
  }, [reviews, calculateSpaceModes, getFilteredReviews]);

  return {
    reviews,
    calibration,
    loading,
    saveReview,
    getReview,
    getAllReviews,
    deleteReview,
    getCalibrationPercentages,
    getCalibrationNudge,
    loadSeedData,
    getBenchmarkModes,
  };
};
