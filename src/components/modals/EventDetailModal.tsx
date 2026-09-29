import React, { useState } from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Send,
  Download,
  Clock,
  UserCheck,
  Copy,
  Check
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const {
    selectedAlert,
    setSelectedAlert,
    acknowledgeAlert,
    resolveAlert,
    markFalsePositive,
    escalateAlert
  } = useSurveillance();

  const [copied, setCopied] = useState(false);

  if (!selectedAlert) return null;

  const handleCopyEvidence = () => {
    const evidencePayload = JSON.stringify(selectedAlert, null, 2);
    navigator.clipboard?.writeText(evidencePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityBadge = () => {
    switch (selectedAlert.severity) {
      case 'CRITICAL':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600/30 text-rose-300 border border-rose-500/50 flex items-center gap-1.5 shadow-[0_0_10px_rgba(225,29,72,0.3)]">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            CRITICAL SEVERITY
          </span>
        );
      case 'WARNING':
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-600/30 text-amber-300 border border-amber-500/50 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5">
            INFORMATIONAL
          </span>
        );
    }
  };

  const getStatusBadge = () => {
    switch (selectedAlert.status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-600 text-white">NEW</span>;
      case 'ACKNOWLEDGED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-600 text-white">ACKNOWLEDGED</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-600 text-white">RESOLVED</span>;
      case 'FALSE_POSITIVE':
        return <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-600 text-slate-200">FALSE POSITIVE</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#081224] border border-[#1e467d] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="h-14 px-5 bg-[#0a1832] border-b border-[#183966] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-tech text-base font-bold text-white tracking-wider">
              EVENT: {selectedAlert.id}
            </span>
            {getSeverityBadge()}
            {getStatusBadge()}
          </div>

          <button
            onClick={() => setSelectedAlert(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#0d2244] hover:bg-[#153466] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Grid: Snapshot & Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Snapshot Container */}
            <div className="rounded-xl bg-[#040812] border border-[#183561] p-3 flex flex-col justify-between">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-tech">
                Forensic Target Snapshot
              </div>

              <div className="relative aspect-video rounded-lg bg-[#0d1729] border border-[#1e4379] overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:8px_8px] opacity-20" />
                
                {/* Target figure silhouette */}
                <div className="relative w-12 h-24 bg-slate-900 border-2 border-rose-500 rounded-sm flex flex-col items-center pt-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-rose-400" />
                  <div className="w-8 h-10 bg-slate-800 mt-1" />
                </div>

                {/* Overlaid bounding box label */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-tech font-bold shadow">
                  {selectedAlert.detectionType} {selectedAlert.confidence}%
                </div>

                {selectedAlert.trackId && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-cyan-300 font-mono text-[10px]">
                    TRACK: {selectedAlert.trackId}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Parameters */}
            <div className="rounded-xl bg-[#060c18] border border-[#142749] p-4 flex flex-col justify-between space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-tech">
                Incident Parameters
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Camera Source</span>
                  <span className="font-tech font-bold text-cyan-300">{selectedAlert.cameraId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sector / Zone</span>
                  <span className="font-semibold text-slate-200">{selectedAlert.zoneName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp</span>
                  <span className="font-mono-num text-slate-200">{selectedAlert.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Classification Confidence</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedAlert.confidence}%</span>
                </div>
                {selectedAlert.trackId && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned ByteTrack ID</span>
                    <span className="font-mono text-cyan-400">{selectedAlert.trackId}</span>
                  </div>
                )}
                {selectedAlert.assignedPatrol && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Unit</span>
                    <span className="font-semibold text-amber-300">{selectedAlert.assignedPatrol}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-[#142749]">
                <span className="text-slate-400 block text-[10px]">Incident Summary</span>
                <p className="text-xs text-slate-200 leading-relaxed mt-0.5">
                  {selectedAlert.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#060c18] border border-[#142749]">
            {selectedAlert.status === 'NEW' && (
              <button
                onClick={() => acknowledgeAlert(selectedAlert.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acknowledge Alert</span>
              </button>
            )}

            <button
              onClick={() => escalateAlert(selectedAlert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Escalate & Dispatch QRF</span>
            </button>

            {selectedAlert.status !== 'RESOLVED' && (
              <button
                onClick={() => resolveAlert(selectedAlert.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Mark Threat Resolved</span>
              </button>
            )}

            <button
              onClick={() => markFalsePositive(selectedAlert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e213d] hover:bg-[#153460] border border-[#1c437a] text-slate-300 text-xs font-medium transition-all"
            >
              <span>False Positive</span>
            </button>

            <button
              onClick={handleCopyEvidence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e213d] hover:bg-[#153460] border border-[#1c437a] text-slate-300 text-xs font-medium transition-all ml-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Export JSON Log'}</span>
            </button>
          </div>

          {/* Chronological Audit Trail */}
          <div className="rounded-xl bg-[#060c18] border border-[#142749] p-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 font-tech flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Immutable Chain-of-Custody Audit Trail</span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#142d54]">
              {selectedAlert.auditTrail.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-3 pl-6 relative">
                  <div className="absolute left-1 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-num text-[11px] font-semibold text-cyan-300">
                        {item.timestamp}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0f2444] border border-[#1b3e6d] text-slate-300">
                        {item.user}
                      </span>
                    </div>
                    <div className="text-slate-200 mt-0.5">
                      {item.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
