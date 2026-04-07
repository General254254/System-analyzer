import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function HealthGauge({ score, lifespanMonths }) {
  const isNA = score === undefined || score === null;
  const displayScore = isNA ? 0 : score;

  const data = [{ name: 'Health', value: displayScore }];
  
  let fillTheme = '#22c55e'; // green-500
  if (displayScore < 50) fillTheme = '#ef4444'; // red-500
  else if (displayScore < 80) fillTheme = '#f59e0b'; // amber-500
  
  if (isNA) fillTheme = '#64748b'; // slate-500

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-md border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
      <h2 className="text-lg font-semibold mb-2 text-slate-200">System Health</h2>
      <div className="w-56 h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="75%" 
            outerRadius="100%" 
            barSize={20} 
            data={data}
            startAngle={210}
            endAngle={-30}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              minAngle={15}
              background={{ fill: '#334155' }}
              clockWise
              dataKey="value"
              fill={fillTheme}
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
          <span className="text-5xl font-bold tracking-tight" style={{ color: fillTheme }}>
            {isNA ? '--' : displayScore}
          </span>
          <span className="text-sm text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <div className="mt-2 text-center z-10 bg-slate-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Est. Lifespan</p>
        <p className="text-xl font-bold text-slate-100">
          {lifespanMonths !== undefined ? `${lifespanMonths} mos` : '--'}
        </p>
      </div>
    </div>
  );
}
