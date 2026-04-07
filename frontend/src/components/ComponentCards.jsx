import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, MemoryStick, HardDrive, Battery } from 'lucide-react';

export default function ComponentCards({ componentScores, metrics }) {
  const getStatus = (score) => {
    if (score < 50) return { label: 'Critical', color: 'text-red-500', bg: 'bg-red-500' };
    if (score < 80) return { label: 'Moderate', color: 'text-amber-500', bg: 'bg-amber-500' };
    return { label: 'Good', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const cards = [
    {
      id: 'CPU',
      title: 'Processor',
      icon: <Cpu className="w-5 h-5 text-slate-400" />,
      score: componentScores?.CPU,
      value: metrics?.cpu_percent != null ? `${metrics.cpu_percent.toFixed(1)}%` : '--',
      subtitle: metrics?.cpu_freq_current ? `${metrics.cpu_freq_current.toFixed(0)} MHz` : 'Usage'
    },
    {
      id: 'RAM',
      title: 'Memory',
      icon: <MemoryStick className="w-5 h-5 text-slate-400" />,
      score: componentScores?.RAM,
      value: metrics?.ram_percent != null ? `${metrics.ram_percent.toFixed(1)}%` : '--',
      subtitle: metrics?.ram_used_bytes && metrics?.ram_total_bytes 
        ? `${(metrics.ram_used_bytes / 1e9).toFixed(1)} GB / ${(metrics.ram_total_bytes / 1e9).toFixed(1)} GB`
        : 'Usage'
    },
    {
      id: 'Disk',
      title: 'Storage',
      icon: <HardDrive className="w-5 h-5 text-slate-400" />,
      score: componentScores?.Disk,
      value: metrics?.disk_percent != null ? `${metrics.disk_percent.toFixed(1)}%` : '--',
      subtitle: metrics?.disk_free_bytes 
        ? `${(metrics.disk_free_bytes / 1024**3).toFixed(1)} GB Free`
        : 'Usage'
    },
    {
      id: 'Battery',
      title: 'Battery',
      icon: <Battery className="w-5 h-5 text-slate-400" />,
      score: componentScores?.Battery,
      value: metrics?.battery_percent != null ? `${metrics.battery_percent.toFixed(1)}%` : 'N/A',
      subtitle: metrics?.battery_plugged ? 'Plugged In' : 'On Battery'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const isNA = card.score === -1 || card.score === undefined;
        const status = isNA ? { label: 'N/A', color: 'text-slate-400', bg: 'bg-slate-600' } : getStatus(card.score);
        
        return (
          <motion.div 
            key={card.id}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-700 flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                {card.icon}
                <span className="font-medium text-slate-300">{card.title}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded bg-slate-900 ${status.color}`}>
                {status.label}
              </span>
            </div>
            
            <div className="flex items-end space-x-2 mb-1">
              <span className="text-3xl font-bold text-slate-100">{card.value}</span>
            </div>
            
            <p className="text-sm text-slate-400 mb-4">{card.subtitle}</p>
            
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-auto">
              <motion.div 
                className={`h-full ${status.bg}`}
                initial={{ width: 0 }}
                animate={{ width: isNA ? 0 : `${card.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
