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

// Color palette for SPACE dimensions
export const SPACE_COLORS = {
  S: '#E6A855', // gold
  P: '#7CB9E8', // sky blue
  A: '#9ACD32', // yellow-green
  C: '#E88D8D', // coral
  E: '#B19CD9', // lavender
};

export const SPACE_LABELS = {
  S: 'Story',
  P: 'Pageantry',
  A: 'Amusement',
  C: 'Captivation',
  E: 'Emotion',
};

export const SCORE_LABELS = {
  1: 'Below Par',
  2: 'Average',
  3: 'Above Average',
  4: 'Superlative',
  5: 'Era-Defining',
};

const SpaceRadarChart = ({ scores, size = 300, showLabels = true, showDots = true, colorCoded = false }) => {
  const DIMENSIONS = ['S', 'P', 'A', 'C', 'E'];
  
  const data = DIMENSIONS.map((key) => ({
    key,
    axis: colorCoded ? key : (showLabels ? SPACE_LABELS[key] : key),
    value: scores[key] || 0,
    fullMark: 5,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { key, value } = payload[0].payload;
      return (
        <div className="bg-charcoal border border-gold/30 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-gold font-display text-sm">{SPACE_LABELS[key]}</p>
          <p className="text-cream text-lg font-semibold">
            {value} <span className="text-silver text-sm">/ 5</span>
          </p>
          <p className="text-silver text-xs">{SCORE_LABELS[value]}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tick for color-coded labels with letter inside colored circle
  const renderColorCodedTick = (props) => {
    const { x, y, payload } = props;
    const key = payload.value;
    const color = SPACE_COLORS[key] || '#d4af37';
    
    return (
      <g>
        {/* Colored circle background */}
        <circle
          cx={x}
          cy={y}
          r={14}
          fill={color}
        />
        {/* Letter */}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#0a0a0f"
          fontSize={12}
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {key}
        </text>
      </g>
    );
  };

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 25, right: 25, bottom: 25, left: 25 }}>
          <PolarGrid 
            stroke="#2a2a3a" 
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="axis"
            tick={colorCoded ? renderColorCodedTick : { 
              fill: '#a0a0b0', 
              fontSize: showLabels ? 12 : 14,
              fontFamily: 'Source Sans 3',
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={colorCoded ? false : { fill: '#a0a0b0', fontSize: 10 }}
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
          {!colorCoded && <Tooltip content={<CustomTooltip />} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpaceRadarChart;
