import React from 'react';
import HealthGauge from './components/HealthGauge';
import ComponentCards from './components/ComponentCards';
import LiveChart from './components/LiveChart';
import FlagList from './components/FlagList';
import ReportPanel from './components/ReportPanel';
import { useMetrics } from './hooks/useMetrics';
import { useHealth } from './hooks/useHealth';
import { Activity } from 'lucide-react';

function App() {
  const { metrics, isError: metricsError } = useMetrics();
  const { healthReport, triggerScan, isScanning, isError: healthError } = useHealth();

  // If the backend is unreachable, we will show skeletal data 
  // until the FastAPI server from Phase 2 drops in.
  const isDemo = metricsError || !metrics;

  const displayMetrics = metrics || {
    cpu_percent: 45,
    cpu_freq_current: 3200,
    ram_percent: 62,
    disk_percent: 48,
    battery_percent: 89
  };

  const displayHealth = healthReport || {
    overall_score: 74,
    estimated_lifespan_months: 24,
    component_scores: { CPU: 80, RAM: 60, Disk: 90, Battery: 100 },
    flags: ["Mock server: API Unavailable", "Displaying placeholder metrics"],
    recommendations: ["Ensure FastAPI backend runs on :8000"]
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                System Health Analyzer
              </h1>
              <p className="text-sm text-slate-400">Live Device Diagnostics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isDemo && (
              <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded text-xs font-bold mr-4 border border-amber-500/20 animate-pulse">
                BACKEND DISCONNECTED
              </span>
            )}
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">Monitoring Active</span>
          </div>
        </header>

        {/* Top Grid: Gauge + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <HealthGauge 
              score={displayHealth.overall_score} 
              lifespanMonths={displayHealth.estimated_lifespan_months} 
            />
          </div>
          <div className="lg:col-span-3">
            <ComponentCards 
              componentScores={displayHealth.component_scores} 
              metrics={displayMetrics} 
            />
          </div>
        </div>

        {/* Bottom Grid: Chart + Flags + Report */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <LiveChart metrics={displayMetrics} />
          </div>
          <div className="lg:col-span-1">
            <FlagList flags={displayHealth.flags} />
          </div>
          <div className="lg:col-span-1">
            <ReportPanel 
              healthReport={displayHealth} 
              triggerScan={triggerScan}
              isScanning={isScanning}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
