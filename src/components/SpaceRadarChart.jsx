import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const SPACE_LABELS = {
  S: 'Story',
  P: 'Pageantry',
  A: 'Amusement',
  C: 'Captivation',
  E: 'Emotion',
};

const SCORE_LABELS = {
  1: 'Below Par',
  2: 'Average',
  3: 'Above Average',
  4: 'Superlative',
  5: 'Era-Defining',
};

const SpaceRadarChart = ({ scores, size = 300, showLabels = true, showDots = true }) => {
  const data = Object.entries(SPACE_LABELS).map(([key, label]) => ({
    axis: showLabels ? label : key,
    value: scores[key] || 0,
    fullMark: 5,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { axis, value } = payload[0].payload;
      return (
        <div className="bg-charcoal border border-gold/30 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-gold font-display text-sm">{axis}</p>
          <p className="text-cream text-lg font-semibold">
            {value} <span className="text-silver text-sm">/ 5</span>
          </p>
          <p className="text-silver text-xs">{SCORE_LABELS[value]}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            stroke="#2a2a3a" 
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ 
              fill: '#a0a0b0', 
              fontSize: showLabels ? 12 : 14,
              fontFamily: 'Source Sans 3',
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: '#a0a0b0', fontSize: 10 }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name="SPACE"
            dataKey="value"
            stroke="#d4af37"
            fill="#d4af37"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={showDots ? {
              r: 4,
              fill: '#d4af37',
              stroke: '#f0d878',
              strokeWidth: 2,
            } : false}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpaceRadarChart;
