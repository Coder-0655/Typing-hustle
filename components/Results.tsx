
import React from 'react';
import { HistoryChart } from './HistoryChart';
import type { TestResult } from '../types';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  history: TestResult[];
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ wpm, accuracy, history, onRestart }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-bold text-cyan-400">Race Finished!</h2>
      
      <div className="flex justify-around w-full max-w-sm my-8">
        <div className="flex flex-col">
          <span className="text-gray-400">WPM</span>
          <span className="text-5xl font-bold text-white">{wpm}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400">Accuracy</span>
          <span className="text-5xl font-bold text-white">{accuracy}%</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mb-8 px-6 py-3 bg-cyan-500 text-gray-900 font-bold text-lg rounded-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Try Again
      </button>

      {history.length > 1 && (
        <div className="w-full mt-4">
          <h3 className="text-2xl font-bold text-gray-300 mb-4">Your Progress</h3>
          <HistoryChart history={history} />
        </div>
      )}
    </div>
  );
};
