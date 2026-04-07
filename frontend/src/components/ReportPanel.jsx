import React from 'react';
import { Download, CheckCircle, Clock } from 'lucide-react';

export default function ReportPanel({ healthReport, triggerScan, isScanning }) {
  const recommendations = healthReport?.recommendations || [];

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-200">Recommendations</h3>
        <button 
          onClick={triggerScan}
          disabled={isScanning}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          {isScanning ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Clock className="w-4 h-4" />
          )}
          <span>New Scan</span>
        </button>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        {recommendations.length > 0 ? (
          <ul className="space-y-4">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {rec}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-full py-8 text-slate-400">
            <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
            <p>Your system is optimized.</p>
            <p className="text-sm mt-1">No recommendations at this time.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex gap-3">
        <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition rounded py-2 text-sm font-medium flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>JSON</span>
        </button>
        <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition rounded py-2 text-sm font-medium flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>TEXT</span>
        </button>
      </div>
    </div>
  );
}
