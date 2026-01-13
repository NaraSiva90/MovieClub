import React from 'react';
import SpaceRadarChart from './SpaceRadarChart';

const DIMENSION_CONFIG = {
  S: {
    name: 'Story',
    description: 'Is the narrative compelling? Pacing, stakes, payoff.',
    fullDescription: 'Story measures narrative craft—structure, pacing, tension, resolution. A high Story score means the plot holds together, the stakes feel real, and the payoff is earned. This isn\'t about complexity; a simple story well-told scores higher than a convoluted mess.',
    examples: {
      five: 'Goodfellas, Pulp Fiction, Memento, Parasite—films that redefined narrative structure.',
      two: 'Generic action films where plot exists only to connect set pieces.',
    },
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  P: {
    name: 'Pageantry',
    description: 'How good does it look? Spectacle, beauty, visual coherence.',
    fullDescription: 'Pageantry measures visual impact—cinematography, production design, VFX, spectacle. A high Pageantry score means the film is visually memorable, whether through grand scale or intimate beauty. This isn\'t about budget; a well-shot indie can outscore a bloated blockbuster.',
    examples: {
      five: 'Avatar, 300, Blade Runner 2049, Bahubali 2—films that redefined visual possibility.',
      two: 'Competent but forgettable TV-movie aesthetics.',
    },
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  A: {
    name: 'Amusement',
    description: 'Is it fun? Would you watch again? Pure enjoyment.',
    fullDescription: 'Amusement measures entertainment value—pure enjoyment, rewatchability, the pleasure of the experience. A high Amusement score means you\'d happily watch it again. This is distinct from quality; a "guilty pleasure" can score high here while scoring lower elsewhere.',
    examples: {
      five: 'Goodfellas, Sholay, When Harry Met Sally, Raiders of the Lost Ark—endlessly rewatchable.',
      two: 'Respectable but dull films you\'d never revisit.',
    },
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  C: {
    name: 'Captivation',
    description: 'Do the performers hold your attention? Presence, magnetism.',
    fullDescription: 'Captivation measures screen presence—the ability of performers to command your attention. A high Captivation score means you can\'t look away when they\'re on screen. This isn\'t about acting technique; it\'s about magnetism, whether through intensity, charisma, or vulnerability.',
    examples: {
      five: 'Heath Ledger in Dark Knight, Rajesh Khanna in Aradhana, the Goodfellas trio—performances that redefined screen presence.',
      two: 'Adequate performances that don\'t distract but don\'t compel.',
    },
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  E: {
    name: 'Emotion',
    description: 'Does it make you feel something? Joy, dread, tears, warmth.',
    fullDescription: 'Emotion measures affective impact—does the film make you feel something? A high Emotion score means genuine emotional response: tears, joy, dread, catharsis. This isn\'t about melodrama; restrained films can be more emotionally devastating than overwrought ones.',
    examples: {
      five: 'Schindler\'s List, LOTR: Return of the King, Titanic, Grave of the Fireflies—films that leave you changed.',
      two: 'Films that aim for emotion but don\'t land, or don\'t try.',
    },
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
};

const DimensionDeepDive = ({ dimension, reviews, onClose, onFilterByPeak }) => {
  const config = DIMENSION_CONFIG[dimension];
  
  if (!config) return null;

  // Calculate stats for this dimension
  const allScores = reviews.map(r => r.scores[dimension]).filter(Boolean);
  const average = allScores.length > 0 
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : 0;
  
  // Distribution for this dimension
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  allScores.forEach(score => distribution[score]++);
  
  // Films where this dimension is highest (peaks)
  const peakFilms = reviews.filter(r => {
    const scores = Object.entries(r.scores);
    const maxScore = Math.max(...scores.map(([_, v]) => v));
    return r.scores[dimension] === maxScore && maxScore >= 4;
  });
  
  // Films with 5 in this dimension
  const fiveFilms = reviews.filter(r => r.scores[dimension] === 5);
  
  // Films with 4 in this dimension
  const fourFilms = reviews.filter(r => r.scores[dimension] === 4);
  
  // Overall average across all dimensions for comparison
  const allDimensionAverages = {};
  ['S', 'P', 'A', 'C', 'E'].forEach(dim => {
    const scores = reviews.map(r => r.scores[dim]).filter(Boolean);
    allDimensionAverages[dim] = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;
  });
  
  // Check if user over-indexes on this dimension
  const overallAvg = Object.values(allDimensionAverages).reduce((a, b) => a + b, 0) / 5;
  const isOverIndexing = parseFloat(average) > overallAvg + 0.3;
  const isUnderIndexing = parseFloat(average) < overallAvg - 0.3;
  
  // Calibration warning for 5s
  const fivePercentage = allScores.length > 0 
    ? ((distribution[5] / allScores.length) * 100).toFixed(0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-midnight/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-charcoal border border-slate rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-charcoal border-b border-slate p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              {config.icon}
            </div>
            <div>
              <h2 className="font-display text-2xl text-cream">
                <span className="text-gold">{dimension}</span> — {config.name}
              </h2>
              <p className="text-silver text-sm">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-silver hover:text-cream transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Full Definition */}
          <section>
            <h3 className="font-display text-lg text-gold mb-3">What {config.name} Measures</h3>
            <p className="text-silver leading-relaxed">{config.fullDescription}</p>
          </section>
          
          {/* Examples */}
          <section className="bg-slate/20 rounded-xl p-5 space-y-3">
            <div>
              <span className="text-gold font-semibold">5 (Era-Defining):</span>
              <span className="text-silver ml-2">{config.examples.five}</span>
            </div>
            <div>
              <span className="text-silver font-semibold">2 (Average):</span>
              <span className="text-slate ml-2">{config.examples.two}</span>
            </div>
          </section>
          
          {/* Your Stats */}
          {reviews.length > 0 ? (
            <section>
              <h3 className="font-display text-lg text-gold mb-4">Your {config.name} Stats</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-display text-cream">{average}</div>
                  <div className="text-silver text-sm">Average Score</div>
                  <div className="text-xs text-slate mt-1">
                    Overall avg: {overallAvg.toFixed(1)}
                  </div>
                </div>
                <div className="bg-slate/20 rounded-xl p-4 text-center">
                  <div className="text-3xl font-display text-cream">{allScores.length}</div>
                  <div className="text-silver text-sm">Films Rated</div>
                  <div className="text-xs text-slate mt-1">
                    {fiveFilms.length} fives, {fourFilms.length} fours
                  </div>
                </div>
              </div>
              
              {/* Distribution bars */}
              <div className="space-y-2">
                <div className="text-sm text-silver mb-2">Your {config.name} Distribution</div>
                {[5, 4, 3, 2, 1].map(score => {
                  const count = distribution[score];
                  const pct = allScores.length > 0 ? (count / allScores.length) * 100 : 0;
                  return (
                    <div key={score} className="flex items-center gap-3">
                      <span className="text-cream w-4 text-right">{score}</span>
                      <div className="flex-1 h-4 bg-slate/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            score === 5 ? 'bg-gold' : 
                            score === 4 ? 'bg-gold/80' : 
                            score === 3 ? 'bg-gold/60' : 
                            score === 2 ? 'bg-gold/40' : 'bg-gold/20'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-silver text-sm w-12">{count} ({pct.toFixed(0)}%)</span>
                    </div>
                  );
                })}
              </div>
              
              {/* Calibration Note */}
              {(isOverIndexing || isUnderIndexing || parseFloat(fivePercentage) > 10) && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  parseFloat(fivePercentage) > 10
                    ? 'bg-amber-900/20 border-amber-500/30'
                    : 'bg-blue-900/20 border-blue-500/30'
                }`}>
                  <p className="text-sm text-cream">
                    {parseFloat(fivePercentage) > 10 ? (
                      <>
                        <span className="font-semibold">Calibration note:</span> You've given {config.name} a 5 to {fivePercentage}% of films. 
                        Era-defining should be rare—1-2 per decade. Consider if all these truly redefined {config.name.toLowerCase()}.
                      </>
                    ) : isOverIndexing ? (
                      <>
                        <span className="font-semibold">Pattern detected:</span> You rate {config.name} higher than your other dimensions 
                        (avg {average} vs overall {overallAvg.toFixed(1)}). You may value {config.name.toLowerCase()} more than other aspects.
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">Pattern detected:</span> You rate {config.name} lower than your other dimensions 
                        (avg {average} vs overall {overallAvg.toFixed(1)}). You may be more critical of {config.name.toLowerCase()}.
                      </>
                    )}
                  </p>
                </div>
              )}
            </section>
          ) : (
            <section className="bg-slate/20 rounded-xl p-6 text-center">
              <p className="text-silver">Start reviewing films to see your {config.name} stats.</p>
            </section>
          )}
          
          {/* Your Peak Films */}
          {fiveFilms.length > 0 && (
            <section>
              <h3 className="font-display text-lg text-gold mb-3">
                Your Era-Defining {config.name} Films
              </h3>
              <div className="space-y-2">
                {fiveFilms.map(review => (
                  <div 
                    key={review.movieId}
                    className="flex items-center gap-3 p-3 bg-slate/20 rounded-lg"
                  >
                    {review.movieData.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${review.movieData.poster_path}`}
                        alt={review.movieData.title}
                        className="w-10 h-15 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-cream font-medium">{review.movieData.title}</div>
                      <div className="text-silver text-sm">
                        {review.movieData.release_date?.split('-')[0]}
                      </div>
                    </div>
                    <div className="text-gold font-display text-xl">5</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Films where this dimension peaks */}
          {peakFilms.length > 0 && (
            <section>
              <h3 className="font-display text-lg text-gold mb-3">
                Films That Peak in {config.name}
              </h3>
              <p className="text-silver text-sm mb-3">
                Films where {config.name} is the highest-rated dimension
              </p>
              <div className="flex flex-wrap gap-2">
                {peakFilms.slice(0, 8).map(review => (
                  <div 
                    key={review.movieId}
                    className="px-3 py-2 bg-gold/10 border border-gold/30 rounded-lg text-sm"
                  >
                    <span className="text-cream">{review.movieData.title}</span>
                    <span className="text-gold ml-2">{dimension}:{review.scores[dimension]}</span>
                  </div>
                ))}
              </div>
              {peakFilms.length > 8 && (
                <button
                  onClick={() => onFilterByPeak(dimension)}
                  className="mt-3 text-gold hover:text-gold-light text-sm transition-colors"
                >
                  View all {peakFilms.length} films →
                </button>
              )}
            </section>
          )}
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-charcoal border-t border-slate p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate hover:bg-slate/80 text-cream font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DimensionDeepDive;
