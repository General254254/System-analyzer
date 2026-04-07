import React from 'react';
import { AlertCircle, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlagList({ flags }) {
  if (!flags || flags.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col items-center justify-center text-center h-full">
        <div className="bg-slate-700/50 p-3 rounded-full mb-3">
          <ShieldAlert className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-slate-200 font-medium">No active anomalies</h3>
        <p className="text-sm text-slate-400 mt-1">Your system is running smoothly with no detected issues.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-200">Active Alerts</h3>
        <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">
          {flags.length} Issue{flags.length > 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {flags.map((flag, idx) => (
            <motion.div
              key={`${flag}-${idx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-slate-200 font-medium text-sm">{flag}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
