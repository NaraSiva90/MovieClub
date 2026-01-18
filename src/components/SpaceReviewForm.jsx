import React, { useState } from 'react';
import SpaceRadarChart from './SpaceRadarChart';

const SPACE_CONFIG = [
  {
    key: 'S',
    name: 'Story',
    description: 'Is the narrative compelling? Pacing, stakes, payoff.',
  },
  {
    key: 'P',
    name: 'Pageantry',
    description: 'How good does it look? Spectacle, beauty, visual coherence.',
  },
  {
    key: 'A',
    name: 'Amusement',
    description: 'Is it fun? Would you watch again? Pure enjoyment.',
  },
  {
    key: 'C',
    name: 'Captivation',
    description: 'Do the performers hold your attention? Presence, magnetism.',
  },
  {
    key: 'E',
    name: 'Emotion',
    description: 'Does it make you feel something? Joy, dread, tears, warmth.',
  },
];

const SCORE_LABELS = {
  1: 'Below Par',
  2: 'Average',
  3: 'Above Average',
  4: 'Superlative',
  5: 'Era-Defining',
};

const SpaceReviewForm = ({ movie, onSubmit, onCancel, existingReview }) => {
  const [scores, setScores] = useState(
    existingReview?.scores || { S: 3, P: 3, A: 3, C: 3, E: 3 }
  );
  const [text, setText] = useState(existingReview?.text || '');

  const handleScoreChange = (key, value) => {
    setScores(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(scores, text);
  };

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Movie header */}
        <div className="flex items-start gap-6 pb-6 border-b border-slate">
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
              alt={movie.title}
              className="w-24 rounded-lg shadow-lg"
            />
          )}
          <div>
            <h2 className="font-display text-2xl text-cream">{movie.title}</h2>
            <p className="text-silver mt-1">
              {movie.release_date?.split('-')[0]}
              {movie.runtime && ` • ${movie.runtime} min`}
              {movie.languageName && ` • ${movie.languageName}`}
            </p>
            {movie.genres && (
              <p className="text-silver text-sm mt-1">
                {movie.genres.map(g => g.name).join(', ')}
              </p>
            )}
            {movie.processedCredits && (
              <p className="text-silver text-sm mt-2">
                {movie.processedCredits.directors?.length > 0 && (
                  <span>Dir: {movie.processedCredits.directors.join(', ')}</span>
                )}
                {movie.processedCredits.topCast?.length > 0 && (
                  <span> • {movie.processedCredits.topCast.join(', ')}</span>
                )}
                {movie.processedCredits.composers?.length > 0 && (
                  <span> • 🎵 {movie.processedCredits.composers.join(', ')}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Two column layout: Sliders + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-6">
            {SPACE_CONFIG.map(({ key, name, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-cream font-medium">
                    <span className="text-gold font-display text-lg">{key}</span>
                    <span className="ml-2">{name}</span>
                  </label>
                  <span className="text-gold font-semibold">
                    {scores[key]} 
                    <span className="text-silver text-sm ml-2">
                      {SCORE_LABELS[scores[key]]}
                    </span>
                  </span>
                </div>
                <p className="text-silver text-sm">{description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-silver text-sm w-4">1</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={scores[key]}
                    onChange={(e) => handleScoreChange(key, e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-silver text-sm w-4">5</span>
                </div>
                {/* Score indicators */}
                <div className="flex justify-between px-4 text-xs text-slate">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div 
                      key={n} 
                      className={`w-2 h-2 rounded-full transition-colors ${
                        scores[key] >= n ? 'bg-gold' : 'bg-slate'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Live radar chart */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="font-display text-lg text-gold mb-4">Your SPACE Profile</h3>
            <SpaceRadarChart scores={scores} size={280} />
          </div>
        </div>

        {/* Optional text review */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-cream font-medium">Notes (optional)</label>
            <span className={`text-xs ${text.length > 280 ? 'text-red-400' : text.length > 240 ? 'text-gold' : 'text-slate'}`}>
              {text.length}/280
            </span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
            placeholder="Any thoughts on why you scored it this way..."
            rows={3}
            maxLength={280}
            className="w-full bg-charcoal border border-slate rounded-lg px-4 py-3 text-cream placeholder-silver/50 focus:border-gold focus:outline-none transition-colors resize-none"
          />
          <p className="text-slate text-xs">
            Keep it punchy—this appears in your shareable images.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-gold hover:bg-gold-light text-midnight font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {existingReview ? 'Update Review' : 'Save Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-slate hover:border-silver text-silver hover:text-cream rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SpaceReviewForm;
