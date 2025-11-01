
import React from 'react';

interface StatsProps {
  wpm: number;
  accuracy: number;
  timeRemaining: number;
}

export const Stats: React.FC<StatsProps> = ({ wpm, accuracy, timeRemaining }) => {
  const timerColor = timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400';

  return (
    <div className="flex justify-around items-center bg-gray-700/50 p-4 rounded-lg text-center">
      <StatItem label="WPM" value={wpm} />
      <StatItem label="Accuracy" value={`${accuracy}%`} />
      <StatItem label="Time" value={timeRemaining} className={timerColor} />
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: string | number; className?: string }> = ({
  label,
  value,
  className = 'text-cyan-400',
}) => (
  <div className="flex flex-col items-center justify-center w-1/3">
    <span className="text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    <span className={`text-3xl sm:text-4xl font-bold font-mono transition-colors duration-300 ${className}`}>
      {value}
    </span>
  </div>
);
