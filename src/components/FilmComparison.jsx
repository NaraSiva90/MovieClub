import React from 'react';
import SpaceRadarChart from './SpaceRadarChart';

const MEMBER_COLORS = [
  '#E6A855', '#7CB9E8', '#E88D8D', '#9ACD32', '#B19CD9',
  '#F4A460', '#87CEEB', '#DDA0DD', '#98FB98', '#FF6B6B',
];

const SCORE_LABELS = {
  1: 'Below Par',
  2: 'Average',
  3: 'Above Average',
  4: 'Superlative',
  5: 'Era-Defining',
};

const FilmComparison = ({ film, members, userId, onBack }) => {
  const { movieData, reviews } = film;
  const year = movieData.release_date?.split('-')[0];
  const posterUrl = movieData.poster_path
    ? `https://image.tmdb.org/t/p/w185${movieData.poster_path}`
    : null;

  // Build member scores for radar chart overlay
  const currentUserReview = reviews.find(r => r.userId === userId);
  const otherReviews = reviews.filter(r => r.userId !== userId);

  const memberScores = otherReviews.map(review => {
    const member = members.find(m => m.user_id === review.userId);
    const memberIdx = members.findIndex(m => m.user_id === review.userId);
    return {
      name: member?.display_name || 'Unknown',
      scores: review.scores,
      color: MEMBER_COLORS[memberIdx % MEMBER_COLORS.length],
    };
  });

  // Get current user's color
  const currentUserIdx = members.findIndex(m => m.user_id === userId);
  const currentUserColor = MEMBER_COLORS[currentUserIdx % MEMBER_COLORS.length];
  const currentUserMember = members.find(m => m.user_id === userId);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-silver hover:text-cream text-sm inline-flex items-center gap-1 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Club
      </button>

      {/* Film header */}
      <div className="flex gap-6">
        {posterUrl && (
          <img
            src={posterUrl}
            alt={movieData.title}
            className="w-28 rounded-lg shadow-lg flex-shrink-0"
          />
        )}
        <div>
          <h2 className="font-display text-3xl text-cream">
            {movieData.title}
            {year && <span className="text-silver ml-3 text-xl">({year})</span>}
          </h2>
          <p className="text-silver mt-1">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from club members
          </p>
          {movieData.genres && (
            <div className="flex gap-2 mt-3">
              {movieData.genres.map(g => (
                <span key={g.id} className="text-xs bg-slate/30 text-silver px-2 py-1 rounded">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison radar chart */}
      <div className="bg-charcoal border border-slate rounded-xl p-6">
        <h3 className="font-display text-lg text-cream mb-4">SPACE Comparison</h3>
        <div className="flex justify-center">
          <SpaceRadarChart
            scores={currentUserReview?.scores || null}
            size={320}
            showLabels={true}
            showDots={true}
            memberScores={memberScores}
            showMemberLegend={true}
            currentUserName={currentUserMember?.display_name || 'You'}
            currentUserColor={currentUserColor}
          />
        </div>
      </div>

      {/* Individual scores table */}
      <div className="bg-charcoal border border-slate rounded-xl p-6">
        <h3 className="font-display text-lg text-cream mb-4">Score Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate">
                <th className="text-left text-silver font-normal py-2 pr-4">Member</th>
                {['S', 'P', 'A', 'C', 'E'].map(dim => (
                  <th key={dim} className="text-center text-gold font-display py-2 px-3">{dim}</th>
                ))}
                <th className="text-center text-silver font-normal py-2 pl-4">Avg</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => {
                const member = members.find(m => m.user_id === review.userId);
                const memberIdx = members.findIndex(m => m.user_id === review.userId);
                const color = MEMBER_COLORS[memberIdx % MEMBER_COLORS.length];
                const avg = (Object.values(review.scores).reduce((a, b) => a + b, 0) / 5).toFixed(1);
                const isCurrentUser = review.userId === userId;

                return (
                  <tr key={review.userId} className="border-b border-slate/30">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className={isCurrentUser ? 'text-cream font-medium' : 'text-silver'}>
                          {member?.display_name || 'Unknown'}
                          {isCurrentUser && <span className="text-slate ml-1">(you)</span>}
                        </span>
                      </div>
                    </td>
                    {['S', 'P', 'A', 'C', 'E'].map(dim => (
                      <td key={dim} className="text-center py-3 px-3">
                        <span className="text-cream">{review.scores[dim]}</span>
                      </td>
                    ))}
                    <td className="text-center py-3 pl-4">
                      <span className="text-gold font-medium">{avg}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review texts */}
      {reviews.some(r => r.text) && (
        <div className="space-y-4">
          <h3 className="font-display text-lg text-cream">Reviews</h3>
          {reviews.filter(r => r.text).map(review => {
            const member = members.find(m => m.user_id === review.userId);
            const memberIdx = members.findIndex(m => m.user_id === review.userId);
            const color = MEMBER_COLORS[memberIdx % MEMBER_COLORS.length];

            return (
              <div key={review.userId} className="bg-charcoal border border-slate rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-cream text-sm font-medium">
                    {member?.display_name || 'Unknown'}
                  </span>
                </div>
                <p className="text-silver text-sm italic">{review.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilmComparison;
