import React, { useState, useEffect } from 'react';
import { useTMDB } from './hooks/useTMDB';
import { useLocalReviews } from './hooks/useLocalReviews';
import FilmSearch from './components/FilmSearch';
import SpaceReviewForm from './components/SpaceReviewForm';
import SpaceRadarChart from './components/SpaceRadarChart';
import CalibrationStats from './components/CalibrationStats';
import ReviewCard from './components/ReviewCard';
import DimensionDeepDive from './components/DimensionDeepDive';
import ShareableReview from './components/ShareableReview';
import { SEED_REVIEWS } from './seedData';

const App = () => {
  const tmdb = useTMDB();
  const {
    calibration,
    saveReview,
    getReview,
    getAllReviews,
    deleteReview,
    getCalibrationPercentages,
    getCalibrationNudge,
    loadSeedData,
  } = useLocalReviews();

  const [view, setView] = useState('home'); // 'home' | 'review' | 'my-reviews'
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [shareReview, setShareReview] = useState(null);

  // Fetch movie details when a movie is selected
  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedMovie) {
        const details = await tmdb.getMovieDetails(selectedMovie.id);
        setSelectedMovieDetails(details);
      }
    };
    fetchDetails();
  }, [selectedMovie, tmdb]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    const existing = getReview(movie.id);
    setExistingReview(existing);
    setView('review');
  };

  const handleSubmitReview = (scores, text) => {
    saveReview(
      selectedMovie.id,
      selectedMovieDetails || selectedMovie,
      scores,
      text
    );
    setView('my-reviews');
    setSelectedMovie(null);
    setSelectedMovieDetails(null);
    setExistingReview(null);
  };

  const handleCancelReview = () => {
    setView('home');
    setSelectedMovie(null);
    setSelectedMovieDetails(null);
    setExistingReview(null);
  };

  const handleEditReview = (review) => {
    setSelectedMovie(review.movieData);
    setSelectedMovieDetails(review.movieData);
    setExistingReview(review);
    setView('review');
  };

  const handleDeleteReview = (movieId) => {
    if (window.confirm('Delete this review?')) {
      deleteReview(movieId);
    }
  };

  const handleLoadSeedData = () => {
    if (window.confirm('Load 18 sample reviews? This will add to your existing reviews.')) {
      loadSeedData(SEED_REVIEWS);
    }
  };

  const handleDimensionClick = (dimension) => {
    setSelectedDimension(dimension);
  };

  const handleCloseDimension = () => {
    setSelectedDimension(null);
  };

  const handleFilterByPeak = (dimension) => {
    setSelectedDimension(null);
    setView('my-reviews');
    // Future: could add a filter state here
  };

  const handleShareReview = (review) => {
    setShareReview(review);
  };

  const reviews = getAllReviews();
  const percentages = getCalibrationPercentages();
  const nudge = getCalibrationNudge();

  return (
    <div className="min-h-screen bg-midnight">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <header className="border-b border-slate/50 bg-midnight/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12,2 15,8 22,9 17,14 18,21 12,18 6,21 7,14 2,9 9,8" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-xl text-cream">Movie Club</h1>
                <p className="text-silver text-xs tracking-wider">SPACE REVIEWS</p>
              </div>
            </button>

            <nav className="flex gap-6">
              <button
                onClick={() => setView('home')}
                className={`text-sm font-medium transition-colors ${
                  view === 'home' ? 'text-gold' : 'text-silver hover:text-cream'
                }`}
              >
                Review
              </button>
              <button
                onClick={() => setView('my-reviews')}
                className={`text-sm font-medium transition-colors ${
                  view === 'my-reviews' ? 'text-gold' : 'text-silver hover:text-cream'
                }`}
              >
                My Reviews
                {reviews.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold text-xs rounded-full">
                    {reviews.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Home / Search view */}
        {view === 'home' && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="font-display text-4xl md:text-5xl">
                <span className="gradient-text">Rate films properly.</span>
              </h2>
              <p className="text-silver text-lg">
                Stop comparing Sholay to Schindler's List. SPACE reviews measure
                films across five dimensions—Story, Pageantry, Amusement,
                Captivation, and Emotion.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <FilmSearch onSelect={handleSelectMovie} tmdb={tmdb} />
            </div>

            {/* SPACE explainer */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {[
                { key: 'S', name: 'Story', desc: 'Narrative, pacing, stakes' },
                { key: 'P', name: 'Pageantry', desc: 'Visuals, spectacle, beauty' },
                { key: 'A', name: 'Amusement', desc: 'Fun, rewatchability' },
                { key: 'C', name: 'Captivation', desc: 'Presence, magnetism' },
                { key: 'E', name: 'Emotion', desc: 'Feeling, impact' },
              ].map(({ key, name, desc }, i) => (
                <button
                  key={key}
                  onClick={() => handleDimensionClick(key)}
                  className="bg-charcoal border border-slate rounded-lg p-4 text-center hover:border-gold/50 hover:bg-charcoal/80 transition-all group cursor-pointer"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-gold font-display text-3xl mb-1 group-hover:scale-110 transition-transform">{key}</div>
                  <div className="text-cream font-medium">{name}</div>
                  <div className="text-silver text-sm mt-1">{desc}</div>
                  <div className="text-gold/0 group-hover:text-gold/60 text-xs mt-2 transition-colors">
                    Click to explore →
                  </div>
                </button>
              ))}
            </div>

            {/* Scale explainer */}
            <div className="max-w-2xl mx-auto bg-charcoal border border-slate rounded-xl p-6">
              <h3 className="font-display text-lg text-gold mb-4">The Scale</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream">5 — Era-Defining</span>
                  <span className="text-silver">Top 1%. One or two per decade.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream">4 — Superlative</span>
                  <span className="text-silver">Top 5%. Excellent.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream">3 — Above Average</span>
                  <span className="text-silver">75th-95th percentile.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream">2 — Average</span>
                  <span className="text-silver">40th-75th percentile. Most films.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream">1 — Below Par</span>
                  <span className="text-silver">Bottom 40%.</span>
                </div>
              </div>
            </div>

            {/* Calibration preview if they have reviews */}
            {calibration.total > 0 && (
              <div className="max-w-md mx-auto">
                <CalibrationStats
                  calibration={calibration}
                  percentages={percentages}
                  nudge={nudge}
                />
              </div>
            )}
          </div>
        )}

        {/* Review form view */}
        {view === 'review' && selectedMovie && (
          <div className="max-w-4xl mx-auto">
            <SpaceReviewForm
              movie={selectedMovieDetails || selectedMovie}
              onSubmit={handleSubmitReview}
              onCancel={handleCancelReview}
              existingReview={existingReview}
            />
          </div>
        )}

        {/* My reviews view */}
        {view === 'my-reviews' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-display text-3xl text-cream">My Reviews</h2>
                <p className="text-silver mt-1">
                  {reviews.length} {reviews.length === 1 ? 'film' : 'films'} reviewed
                </p>
              </div>
              <button
                onClick={() => setView('home')}
                className="bg-gold hover:bg-gold-light text-midnight font-semibold py-2 px-5 rounded-lg transition-colors"
              >
                + Add Review
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Reviews list */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length === 0 ? (
                  <div className="bg-charcoal border border-slate rounded-xl p-12 text-center">
                    <div className="text-silver mb-4">
                      <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <h3 className="font-display text-xl text-cream mb-2">No reviews yet</h3>
                    <p className="text-silver mb-6">Search for a film to write your first SPACE review.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setView('home')}
                        className="bg-gold hover:bg-gold-light text-midnight font-semibold py-2 px-5 rounded-lg transition-colors"
                      >
                        Start Reviewing
                      </button>
                      <button
                        onClick={handleLoadSeedData}
                        className="border border-gold/50 hover:border-gold text-gold hover:text-gold-light font-semibold py-2 px-5 rounded-lg transition-colors"
                      >
                        Load Sample Data
                      </button>
                    </div>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review.movieId}
                      review={review}
                      onEdit={handleEditReview}
                      onDelete={handleDeleteReview}
                      onShare={handleShareReview}
                    />
                  ))
                )}
              </div>

              {/* Calibration sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <CalibrationStats
                    calibration={calibration}
                    percentages={percentages}
                    nudge={nudge}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate/30 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* TMDB Attribution */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                  alt="TMDB Logo"
                  className="h-6 opacity-70 hover:opacity-100 transition-opacity"
                />
              </a>
              <p className="text-slate text-xs max-w-xs">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </p>
            </div>
            
            {/* App info */}
            <div className="text-center md:text-right">
              <p className="text-silver text-sm">Movie Club — SPACE Reviews</p>
              <button
                onClick={() => setShowAbout(true)}
                className="text-gold hover:text-gold-light text-xs transition-colors"
              >
                About & Credits
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Dimension Deep Dive Modal */}
      {selectedDimension && (
        <DimensionDeepDive
          dimension={selectedDimension}
          reviews={reviews}
          onClose={handleCloseDimension}
          onFilterByPeak={handleFilterByPeak}
        />
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-midnight/90 backdrop-blur-sm"
            onClick={() => setShowAbout(false)}
          />
          <div className="relative bg-charcoal border border-slate rounded-2xl max-w-lg w-full p-6 animate-slide-up">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 p-2 text-silver hover:text-cream transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="font-display text-2xl text-cream mb-4">About Movie Club</h2>
            
            <div className="space-y-4 text-silver text-sm">
              <p>
                <strong className="text-cream">Movie Club</strong> replaces simplistic star ratings with 
                SPACE—a five-axis framework measuring Story, Pageantry, Amusement, Captivation, and Emotion.
              </p>
              
              <p>
                The framework emerged from a simple observation: comparing a Hallmark Christmas film 
                to Schindler's List on a single axis is meaningless. Films optimize for different things. 
                SPACE lets each film succeed on its own terms.
              </p>
              
              <div className="pt-4 border-t border-slate">
                <h3 className="text-cream font-medium mb-2">Credits</h3>
                <ul className="space-y-2">
                  <li>SPACE framework: Developed through conversation</li>
                  <li>Built with React, Tailwind CSS, Recharts</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-slate">
                <h3 className="text-cream font-medium mb-3">Film Data Attribution</h3>
                <div className="flex items-start gap-4 bg-slate/20 rounded-lg p-4">
                  <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                      alt="TMDB Logo"
                      className="h-8"
                    />
                  </a>
                  <p className="text-xs text-slate flex-1">
                    This product uses the TMDB API but is not endorsed or certified by TMDB. 
                    Film metadata, posters, and search powered by The Movie Database.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowAbout(false)}
              className="w-full mt-6 py-3 bg-slate hover:bg-slate/80 text-cream font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Shareable Review Modal */}
      {shareReview && (
        <ShareableReview
          review={shareReview}
          onClose={() => setShareReview(null)}
        />
      )}
    </div>
  );
};

export default App;
