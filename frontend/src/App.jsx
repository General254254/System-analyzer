import React from 'react';
import HealthGauge from './components/HealthGauge';
import ComponentCards from './components/ComponentCards';
import LiveChart from './components/LiveChart';
import FlagList from './components/FlagList';
import ReportPanel from './components/ReportPanel';
import HistoryLog from './components/HistoryLog';
import { useMetrics } from './hooks/useMetrics';
import { useHealth } from './hooks/useHealth';
import { Activity, RefreshCcw, WifiOff } from 'lucide-react';

function App() {
  const { metrics, isError: metricsError, isLoading: metricsLoading } = useMetrics();
  const { healthReport, triggerScan, isScanning, isError: healthError, isLoading: healthLoading } = useHealth();

  const isDisconnected = metricsError || healthError;
  const isLoading = metricsLoading && healthLoading;

  // Placeholder while loading the very first time
  if (isLoading && !metrics && !healthReport) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-400">
        <RefreshCcw className="w-12 h-12 animate-spin mb-4 text-blue-500" />
        <h2 className="text-xl font-medium">Connecting to System Backend...</h2>
        <p className="text-sm mt-2">Ensure FastAPI server is running on localhost:8000</p>
      </div>
    );
  }

  // Real data or empty defaults if disconnected (for UI layout)
  const displayMetrics = metrics || {
    cpu_percent: 0,
    cpu_freq_current: 0,
    ram_percent: 0,
    disk_percent: 0,
    battery_percent: null
  };

  const displayHealth = healthReport || {
    overall_score: 0,
    estimated_lifespan_months: 0,
    component_scores: { CPU: 0, RAM: 0, Disk: 0, Battery: -1 },
    flags: [],
    recommendations: []
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans transition-colors duration-500">
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
          
          <div className="flex items-center space-x-4">
            {isDisconnected ? (
              <div className="flex items-center space-x-2 bg-red-500/10 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/20">
                <WifiOff className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Offline</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Live</span>
              </div>
            )}
          </div>
        </header>

        {isDisconnected && !metrics && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl text-center">
            <h3 className="text-amber-500 font-bold mb-1">Backend Connection Error</h3>
            <p className="text-slate-400 text-sm">
              We couldn't reach the system diagnostics API. Please make sure the Python backend is running.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-amber-500 text-slate-900 px-4 py-2 rounded text-sm font-bold hover:bg-amber-400 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Top Grid: Gauge + Cards */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isDisconnected && !metrics ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isDisconnected && !metrics ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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

        {/* History Section */}
        <div className={`transition-opacity duration-300 ${isDisconnected && !metrics ? 'opacity-50' : 'opacity-100'}`}>
          <HistoryLog />
        </div>

      </div>
    </div>
  );
}

export default App;

