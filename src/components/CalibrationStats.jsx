import React from 'react';

const SCORE_CONFIG = [
  { score: 5, label: 'Era-Defining', target: '0-5%', color: 'bg-yellow-400' },
  { score: 4, label: 'Superlative', target: '5-15%', color: 'bg-yellow-500' },
  { score: 3, label: 'Above Average', target: '20-35%', color: 'bg-yellow-600' },
  { score: 2, label: 'Average', target: '35-50%', color: 'bg-yellow-700' },
  { score: 1, label: 'Below Par', target: '10-20%', color: 'bg-yellow-800' },
];

const CalibrationStats = ({ calibration, percentages, nudge }) => {
  if (calibration.total === 0) {
    return (
      <div className="bg-charcoal border border-slate rounded-xl p-6">
        <h3 className="font-display text-lg text-gold mb-2">Your Calibration</h3>
        <p className="text-silver">Start reviewing films to see your score distribution.</p>
      </div>
    );
  }

  return (
    <div className="bg-charcoal border border-slate rounded-xl p-6 space-y-6">
      <div>
        <h3 className="font-display text-lg text-gold mb-1">Your Calibration</h3>
        <p className="text-silver text-sm">{calibration.total} scores across {Math.ceil(calibration.total / 5)} reviews</p>
      </div>

      {/* Distribution bars */}
      <div className="space-y-3">
        {SCORE_CONFIG.map(({ score, label, target }) => {
          const pct = percentages[score] || 0;
          return (
            <div key={score} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-cream">
                  <span className="text-gold font-semibold">{score}</span> {label}
                </span>
                <span className="text-silver">
                  {pct.toFixed(0)}% <span className="text-slate">/ {target}</span>
                </span>
              </div>
              <div className="h-2 bg-slate rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Nudge message */}
      {nudge && (
        <div
          className={`p-4 rounded-lg border ${
            nudge.type === 'warning'
              ? 'bg-amber-900/20 border-amber-500/30 text-amber-200'
              : nudge.type === 'success'
              ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-200'
              : 'bg-blue-900/20 border-blue-500/30 text-blue-200'
          }`}
        >
          <p className="text-sm">{nudge.message}</p>
        </div>
      )}
    </div>
  );
};

export default CalibrationStats;
