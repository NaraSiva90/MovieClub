import React from 'react';
import SpaceRadarChart, { SPACE_COLORS, SPACE_LABELS, SCORE_LABELS } from './SpaceRadarChart';

const ReviewCard = ({ review, onEdit, onDelete, onShare }) => {
  const { movieData, scores, text, createdAt } = review;
  
  // Extract credits info
  const { processedCredits, languageName } = movieData;
  const directors = processedCredits?.directors || [];
  const topCast = processedCredits?.topCast || [];
  const composers = processedCredits?.composers || [];
  
  // SPACE dimension order
  const SPACE_ORDER = ['S', 'P', 'A', 'C', 'E'];
  
  // Truncate review text for display (150 chars)
  const truncatedText = text && text.length > 150 
    ? text.substring(0, 150).trim() + '...' 
    : text;

  return (
    <div className="bg-charcoal border border-slate rounded-xl overflow-hidden hover:border-gold/30 transition-colors animate-slide-up">
      <div className="flex flex-col md:flex-row">
        {/* Left Column: Poster + Info + Review */}
        <div className="flex-1 p-5">
          <div className="flex gap-4">
            {/* Poster */}
            {movieData.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w154${movieData.poster_path}`}
                alt={movieData.title}
                className="w-24 h-36 object-cover rounded-lg shadow-lg flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-36 bg-slate rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-10 h-10 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            )}
            
            {/* Movie Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl text-cream leading-tight">{movieData.title}</h3>
              <p className="text-silver text-sm mt-1">
                {movieData.release_date?.split('-')[0]}
                {languageName && ` • ${languageName}`}
              </p>
              
              {/* Credits */}
              <div className="text-slate text-xs mt-2 space-y-0.5">
                {directors.length > 0 && (
                  <p>Dir: {directors.join(', ')}</p>
                )}
                {topCast.length > 0 && (
                  <p>{topCast.join(', ')}</p>
                )}
                {composers.length > 0 && (
                  <p className="flex items-center gap-1">
                    <span>🎵</span> {composers.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Review Text */}
          {truncatedText && (
            <p className="text-silver text-sm mt-4 leading-relaxed italic">
              "{truncatedText}"
            </p>
          )}
        </div>
        
        {/* Right Column: Radar + SPACE Legend */}
        <div className="md:w-72 p-5 md:border-l border-t md:border-t-0 border-slate bg-midnight/30">
          {/* Color-coded Radar Chart */}
          <div className="flex justify-center mb-4">
            <SpaceRadarChart 
              scores={scores} 
              size={140} 
              showLabels={true} 
              showDots={false} 
              colorCoded={true}
            />
          </div>
          
          {/* SPACE Legend */}
          <div className="space-y-2">
            {SPACE_ORDER.map((key) => {
              const score = scores[key];
              const color = SPACE_COLORS[key];
              const label = SPACE_LABELS[key];
              
              return (
                <div key={key} className="flex items-center gap-2">
                  {/* Color indicator */}
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-midnight font-bold text-xs">{key}</span>
                  </div>
                  
                  {/* Label */}
                  <span className="text-silver text-sm flex-1">{label}</span>
                  
                  {/* Score */}
                  <span 
                    className={`font-bold text-sm ${
                      score === 5 ? 'text-gold' : 
                      score === 4 ? 'text-gold-light' : 
                      'text-silver'
                    }`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center px-5 py-3 border-t border-slate bg-midnight/20">
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
  );
};

export default ReviewCard;
