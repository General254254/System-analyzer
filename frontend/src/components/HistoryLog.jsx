import React from 'react';
import { useHistory } from '../hooks/useHistory';
import { Clock, Calendar, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoryLog() {
  const { history, isLoading, isError } = useHistory();

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (score >= 50) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  if (isLoading && history.length === 0) return null;
  if (isError) return null;

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="p-5 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium text-slate-200">Scan History</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Last 100 sessions recorded</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/30">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Score</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Lifespan</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Anomalies</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {history.length > 0 ? (
              history.map((report) => (
                <motion.tr 
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(report.timestamp).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 font-bold text-slate-100">
                      {getScoreIcon(report.overall_score)}
                      <span>{report.overall_score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {report.estimated_lifespan_months} months
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      report.flags.length > 0 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                        : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                      {report.flags.length} Flag{report.flags.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          report.overall_score >= 80 ? 'bg-green-500' : report.overall_score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${report.overall_score}%` }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                  No scan reports found in the database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
