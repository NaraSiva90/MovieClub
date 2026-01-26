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

// Props:
// - scores: { S, P, A, C, E } - required, the main rating
// - genreMode: { S, P, A, C, E } - optional, user's genre/language mode
// - genreModeLabel: string - optional, label for genre mode (e.g., "Hindi Action")
// - overallMode: { S, P, A, C, E } - optional, user's overall mode
// - showBenchmarks: boolean - whether to show benchmark layers
// - showLegend: boolean - whether to show legend below chart
const SpaceRadarChart = ({ 
  scores, 
  size = 300, 
  showLabels = true, 
  showDots = true, 
  colorCoded = false,
  genreMode = null,
  genreModeLabel = null,
  overallMode = null,
  showBenchmarks = false,
  showLegend = false,
}) => {
  const DIMENSIONS = ['S', 'P', 'A', 'C', 'E'];
  
  // Build data with all layers
  const data = DIMENSIONS.map((key) => {
    const entry = {
      key,
      axis: colorCoded ? key : (showLabels ? SPACE_LABELS[key] : key),
      value: scores[key] || 0,
      fullMark: 5,
    };
    
    if (showBenchmarks && genreMode) {
      entry.genreMode = genreMode[key] || 0;
    }
    
    if (showBenchmarks && overallMode) {
      entry.overallMode = overallMode[key] || 0;
    }
    
    return entry;
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-charcoal border border-gold/30 rounded-lg px-3 py-2 shadow-lg">
          <p className="text-gold font-display text-sm">{SPACE_LABELS[dataPoint.key]}</p>
          <p className="text-cream text-lg font-semibold">
            {dataPoint.value} <span className="text-silver text-sm">/ 5</span>
          </p>
          <p className="text-silver text-xs">{SCORE_LABELS[dataPoint.value]}</p>
          {showBenchmarks && dataPoint.genreMode && (
            <p className="text-blue-300 text-xs mt-1">
              {genreModeLabel} mode: {dataPoint.genreMode}
            </p>
          )}
          {showBenchmarks && dataPoint.overallMode && (
            <p className="text-slate text-xs">
              Overall mode: {dataPoint.overallMode}
            </p>
          )}
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

  // Calculate legend items
  const legendItems = [];
  legendItems.push({ color: '#d4af37', label: 'This film', style: 'solid' });
  if (showBenchmarks && genreMode && genreModeLabel) {
    legendItems.push({ color: '#60a5fa', label: `Your ${genreModeLabel} mode`, style: 'dashed' });
  }
  if (showBenchmarks && overallMode) {
    legendItems.push({ color: '#6b7280', label: 'Your overall mode', style: 'dotted' });
  }

  return (
    <div>
      <div style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            data={data} 
            margin={{ top: 25, right: 25, bottom: 25, left: 25 }}
            outerRadius="70%"
          >
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
              scale="linear"
            />
            
            {/* Overall mode layer (bottom - most transparent) */}
            {showBenchmarks && overallMode && (
              <Radar
                name="Overall Mode"
                dataKey="overallMode"
                stroke="#6b7280"
                strokeDasharray="2 2"
                fill="#6b7280"
                fillOpacity={0.08}
                strokeWidth={1.5}
                strokeOpacity={0.4}
                dot={false}
              />
            )}
            
            {/* Genre mode layer (middle) */}
            {showBenchmarks && genreMode && (
              <Radar
                name="Genre Mode"
                dataKey="genreMode"
                stroke="#60a5fa"
                strokeDasharray="5 3"
                fill="#60a5fa"
                fillOpacity={0.12}
                strokeWidth={1.5}
                strokeOpacity={0.5}
                dot={false}
              />
            )}
            
            {/* Main rating layer (top - most prominent) */}
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
      
      {/* Legend */}
      {showLegend && legendItems.length > 1 && (
        <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
          {legendItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div 
                className="w-4 h-0.5"
                style={{ 
                  backgroundColor: item.color,
                  borderStyle: item.style === 'dashed' ? 'dashed' : item.style === 'dotted' ? 'dotted' : 'solid',
                  borderWidth: item.style !== 'solid' ? '1px' : 0,
                  borderColor: item.color,
                  height: item.style === 'solid' ? '2px' : '0',
                }}
              />
              {item.style === 'dashed' && (
                <svg width="16" height="2" className="-ml-1.5">
                  <line x1="0" y1="1" x2="16" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray="4 2" />
                </svg>
              )}
              {item.style === 'dotted' && (
                <svg width="16" height="2" className="-ml-1.5">
                  <line x1="0" y1="1" x2="16" y2="1" stroke={item.color} strokeWidth="2" strokeDasharray="1 2" />
                </svg>
              )}
              {item.style === 'solid' && (
                <svg width="16" height="2" className="-ml-1.5">
                  <line x1="0" y1="1" x2="16" y2="1" stroke={item.color} strokeWidth="2" />
                </svg>
              )}
              <span style={{ color: item.color }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpaceRadarChart;
