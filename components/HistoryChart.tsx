
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TestResult } from '../types';

interface HistoryChartProps {
  history: TestResult[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ history }) => {
  const chartData = history.map((result, index) => ({
    name: `Test ${index + 1}`,
    wpm: result.wpm,
    accuracy: result.accuracy,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="name" stroke="#A0AEC0" />
          <YAxis stroke="#A0AEC0" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#2D3748', 
              border: '1px solid #4A5568',
              borderRadius: '0.5rem'
            }} 
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend wrapperStyle={{ color: '#A0AEC0' }} />
          <Line type="monotone" dataKey="wpm" stroke="#2DD4BF" activeDot={{ r: 8 }} name="WPM" />
          <Line type="monotone" dataKey="accuracy" stroke="#A0AEC0" strokeDasharray="5 5" name="Accuracy (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
