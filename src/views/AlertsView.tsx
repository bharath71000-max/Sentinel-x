import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  Bell,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
  Download,
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Severity, AlertStatus } from '../types/surveillance';

export const AlertsView: React.FC = () => {
  const { alerts, setSelectedAlert, acknowledgeAlert, resolveAlert } = useSurveillance();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && alert.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCam = alert.cameraId.toLowerCase().includes(q);
      const matchTitle = alert.title.toLowerCase().includes(q);
      const matchZone = alert.zoneName.toLowerCase().includes(q);
      const matchTrack = alert.trackId?.toLowerCase().includes(q);
      if (!matchCam && !matchTitle && !matchZone && !matchTrack) return false;
    }
    return true;
  });

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const newCount = alerts.filter(a => a.status === 'NEW').length;

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Title,Severity,Status,Camera,Zone,Timestamp,Confidence,TrackID']
        .concat(
          alerts.map(
            a =>
              `${a.id},"${a.title}",${a.severity},${a.status},${a.cameraId},"${a.zoneName}",${a.timestamp},${a.confidence}%,${a.trackId || 'N/A'}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ultron_alerts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAcknowledgeAll = () => {
    alerts.filter(a => a.status === 'NEW').forEach(a => acknowledgeAlert(a.id));
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-[1920px] mx-auto w-full">
      {/* Top Banner & KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-tech">
            Active Threat Queue
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono-num text-2xl font-bold text-white">{alerts.length}</span>
            <span className="text-xs text-rose-400 font-semibold">{newCount} Unacknowledged</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-tech flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Critical Incidents
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono-num text-2xl font-bold text-rose-400">{criticalCount}</span>
            <span className="text-xs text-slate-400">High priority dispatch</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-tech">
            Warnings & Anomalies
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono-num text-2xl font-bold text-amber-400">{warningCount}</span>
            <span className="text-xs text-slate-400">Tampering / Objects</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-tech">
            Mean Response Time
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-mono-num text-2xl font-bold text-emerald-400">14.2s</span>
            <span className="text-xs text-slate-400">Target: &lt; 30s</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#081222] border border-[#14294d]">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Camera, Zone, Track ID, or Title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#060c18] border border-[#142749] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#060c18] border border-[#142749] px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Severity:</span>
            <select
              value={severityFilter}
              onChange={e => setSeverityFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#081222]">All Severities</option>
              <option value="CRITICAL" className="bg-[#081222]">Critical</option>
              <option value="WARNING" className="bg-[#081222]">Warning</option>
              <option value="NORMAL" className="bg-[#081222]">Normal</option>
              <option value="INFO" className="bg-[#081222]">Info</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#060c18] border border-[#142749] px-2.5 py-1.5 rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#081222]">All Statuses</option>
              <option value="NEW" className="bg-[#081222]">New (Active)</option>
              <option value="ACKNOWLEDGED" className="bg-[#081222]">Acknowledged</option>
              <option value="RESOLVED" className="bg-[#081222]">Resolved</option>
              <option value="FALSE_POSITIVE" className="bg-[#081222]">False Positive</option>
            </select>
          </div>

          {/* Bulk Actions */}
          <button
            onClick={handleAcknowledgeAll}
            disabled={newCount === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Acknowledge All</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0e2242] hover:bg-[#153460] border border-[#1c437a] text-cyan-300 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-xl bg-[#081222] border border-[#14294d] overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0a1832] border-b border-[#14294d] text-slate-400 font-tech uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Incident Title</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Camera</th>
              <th className="py-3 px-4">Zone</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#122442]">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-500 italic">
                  No alerts matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredAlerts.map(alert => (
                <tr
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className="hover:bg-[#0c1a32] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {alert.id}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {alert.title}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-rose-600/30 text-rose-300 border border-rose-500/50'
                          : alert.severity === 'WARNING'
                          ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50'
                          : 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.status === 'NEW'
                          ? 'bg-rose-600 text-white'
                          : alert.status === 'ACKNOWLEDGED'
                          ? 'bg-cyan-600 text-white'
                          : alert.status === 'RESOLVED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">
                    {alert.cameraId}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {alert.zoneName}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {alert.confidence}%
                  </td>
                  <td className="py-3 px-4 font-mono-num text-slate-400">
                    {alert.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={e => e.stopPropagation()}
                    >
                      {alert.status === 'NEW' ? (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2 py-1 rounded bg-[#10294e] hover:bg-cyan-600 text-cyan-300 hover:text-white font-semibold transition-colors"
                        >
                          Acknowledge
                        </button>
                      ) : alert.status !== 'RESOLVED' ? (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-600 text-emerald-300 hover:text-white font-semibold transition-colors"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Closed</span>
                      )}

                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="p-1 text-slate-400 hover:text-cyan-300"
                        title="View Incident Audit Log"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
