import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LiveChart({ metrics }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!metrics) return;
    
    setHistory((prev) => {
      const now = new Date();
      const newPoint = {
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpu: metrics.cpu_percent || 0,
        ram: metrics.ram_percent || 0,
        disk: metrics.disk_percent || 0
      };
      
      const updated = [...prev, newPoint];
      if (updated.length > 60) {
        return updated.slice(updated.length - 60);
      }
      return updated;
    });
  }, [metrics]);

  return (
    <div className="bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-700 col-span-1 lg:col-span-2 relative">
      <h3 className="text-lg font-medium text-slate-200 mb-4">Historical Usage</h3>
      <div className="h-64 w-full">
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} minTickGap={30} />
              <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="cpu" name="CPU %" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="ram" name="RAM %" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
              {/* Added Disk purely to demonstrate more lines */}
              <Line type="monotone" dataKey="disk" name="Disk %" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-500">
            Waiting for data points...
          </div>
        )}
      </div>
    </div>
  );
}
