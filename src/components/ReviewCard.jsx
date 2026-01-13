import React from 'react';
import SpaceRadarChart from './SpaceRadarChart';

const SCORE_LABELS = {
  1: 'Below Par',
  2: 'Average',
  3: 'Above Average',
  4: 'Superlative',
  5: 'Era-Defining',
};

const ReviewCard = ({ review, onEdit, onDelete, onShare }) => {
  const { movieData, scores, text, createdAt } = review;
  
  // Find peaks (scores of 5)
  const peaks = Object.entries(scores)
    .filter(([_, score]) => score === 5)
    .map(([key]) => key);
  
  // Extract credits info
  const { processedCredits, languageName } = movieData;
  const directors = processedCredits?.directors || [];
  const topCast = processedCredits?.topCast || [];
  const composers = processedCredits?.composers || [];
  
  // Build credits line
  const creditsLine = [];
  if (directors.length > 0) {
    creditsLine.push(`Dir: ${directors.join(', ')}`);
  }
  if (topCast.length > 0) {
    creditsLine.push(topCast.join(', '));
  }
  if (composers.length > 0) {
    creditsLine.push(`🎵 ${composers.join(', ')}`);
  }
  if (languageName) {
    creditsLine.push(languageName);
  }

  return (
    <div className="bg-charcoal border border-slate rounded-xl overflow-hidden hover:border-gold/30 transition-colors animate-slide-up">
      <div className="flex flex-col sm:flex-row">
        {/* Poster */}
        {movieData.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w185${movieData.poster_path}`}
            alt={movieData.title}
            className="w-full sm:w-32 h-48 sm:h-auto object-cover"
          />
        ) : (
          <div className="w-full sm:w-32 h-48 sm:h-auto bg-slate flex items-center justify-center">
            <svg className="w-12 h-12 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-display text-xl text-cream">{movieData.title}</h3>
              <p className="text-silver text-sm mt-1">
                {movieData.release_date?.split('-')[0]}
                {movieData.runtime && ` • ${movieData.runtime} min`}
                {peaks.length > 0 && (
                  <span className="ml-3 text-gold">
                    Peaks: {peaks.join(', ')}
                  </span>
                )}
              </p>
              {/* Credits line */}
              {creditsLine.length > 0 && (
                <p className="text-silver text-xs mt-1 line-clamp-1">
                  {creditsLine.join(' • ')}
                </p>
              )}
            </div>
            
            {/* Mini radar chart */}
            <div className="hidden md:block">
              <SpaceRadarChart scores={scores} size={120} showLabels={false} showDots={false} />
            </div>
          </div>

          {/* Scores inline */}
          <div className="flex flex-wrap gap-3 mt-4">
            {Object.entries(scores).map(([key, score]) => (
              <div
                key={key}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  score === 5
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : score === 4
                    ? 'bg-gold/10 text-gold-light border border-gold/20'
                    : 'bg-slate/50 text-silver border border-slate'
                }`}
              >
                <span className="font-display">{key}</span>: {score}
              </div>
            ))}
          </div>

          {/* Notes */}
          {text && (
            <p className="text-silver mt-4 text-sm line-clamp-2">{text}</p>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate">
            <p className="text-slate text-sm">
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => onShare(review)}
                className="px-3 py-1 text-sm text-gold hover:text-gold-light transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button
                onClick={() => onEdit(review)}
                className="px-3 py-1 text-sm text-silver hover:text-cream transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(review.movieId)}
                className="px-3 py-1 text-sm text-silver hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
