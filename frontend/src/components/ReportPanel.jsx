import React from 'react';
import { Download, CheckCircle, Clock, FileJson, FileText } from 'lucide-react';

export default function ReportPanel({ healthReport, triggerScan, isScanning }) {
  const recommendations = healthReport?.recommendations || [];
  const hasData = healthReport && healthReport.overall_score > 0;

  const downloadReport = (format) => {
    if (!hasData) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let content = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'json') {
      content = JSON.stringify(healthReport, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = `SYSTEM HEALTH REPORT\n`;
      content += `Generated: ${new Date().toLocaleString()}\n`;
      content += `-----------------------------------\n`;
      content += `Overall Score: ${healthReport.overall_score}/100\n`;
      content += `Estimated Lifespan: ${healthReport.estimated_lifespan_months} months\n\n`;
      content += `Component Scores:\n`;
      Object.entries(healthReport.component_scores).forEach(([comp, score]) => {
        content += `  - ${comp}: ${score === -1 ? 'N/A' : score + '/100'}\n`;
      });
      content += `\nFlags:\n`;
      (healthReport.flags.length > 0 ? healthReport.flags : ['None detected']).forEach(flag => {
        content += `  - ${flag}\n`;
      });
      content += `\nRecommendations:\n`;
      (healthReport.recommendations.length > 0 ? healthReport.recommendations : ['System running optimally']).forEach((rec, i) => {
        content += `  ${i + 1}. ${rec}\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-health-report-${timestamp}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-200">Recommendations</h3>
        <button 
          onClick={triggerScan}
          disabled={isScanning}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-1.5 rounded text-sm font-medium shadow-lg shadow-blue-500/20"
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
        <button 
          onClick={() => downloadReport('json')}
          disabled={!hasData}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition rounded-lg py-2 text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileJson className="w-4 h-4" />
          <span>JSON</span>
        </button>
        <button 
          onClick={() => downloadReport('text')}
          disabled={!hasData}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white transition rounded-lg py-2 text-sm font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-4 h-4" />
          <span>TEXT</span>
        </button>
      </div>
    </div>
  );
}
