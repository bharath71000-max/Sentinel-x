import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { AlertTriangle, X, Check, Video, ExternalLink } from 'lucide-react';

export const CriticalAlertPopup: React.FC = () => {
  const {
    criticalPopupAlert,
    setCriticalPopupAlert,
    acknowledgeAlert,
    setSelectedCamera,
    cameras,
    setSelectedAlert
  } = useSurveillance();

  if (!criticalPopupAlert) return null;

  const handleViewCamera = () => {
    const targetCam = cameras.find(c => c.id === criticalPopupAlert.cameraId);
    if (targetCam) {
      setSelectedCamera(targetCam);
    }
  };

  const isAcknowledged = criticalPopupAlert.status === 'ACKNOWLEDGED';

  return (
    <div className="rounded-xl border border-rose-600/70 bg-[#120a16] shadow-[0_0_25px_rgba(225,29,72,0.3)] overflow-hidden transition-all duration-300">
      {/* Alert Header */}
      <div className="h-8 px-3 bg-gradient-to-r from-rose-700 to-rose-900 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
          <span className="font-tech text-xs font-bold tracking-wider uppercase">
            INTRUSION DETECTED
          </span>
        </div>
        <button
          onClick={() => setCriticalPopupAlert(null)}
          className="text-white/80 hover:text-white transition-colors"
          title="Dismiss Popup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body: Thumbnail + Information */}
      <div className="p-3">
        <div className="flex gap-3">
          {/* Tactical Snapshot Thumbnail with Bounding Box */}
          <div className="relative w-28 h-20 rounded bg-[#0a0f1c] border border-rose-500/40 overflow-hidden shrink-0">
            {/* Simulated target visual */}
            <div className="w-full h-full bg-[#182030] flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(#ff0055_1px,transparent_1px)] [background-size:6px_6px] opacity-20" />
              
              {/* Silhouette figure */}
              <div className="relative w-6 h-12 bg-slate-900 rounded-sm flex flex-col items-center pt-1 border border-rose-500">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-rose-400" />
                <div className="w-4 h-5 bg-slate-800 mt-0.5" />
              </div>

              {/* Bounding Box Label Overlay */}
              <div className="absolute top-1 left-1 bg-rose-600 text-white text-[8px] font-tech font-bold px-1 rounded-sm shadow">
                PERSON {criticalPopupAlert.confidence}%
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-[11px] space-y-1">
            <div className="font-bold text-slate-100 font-tech text-xs">
              {criticalPopupAlert.zoneName}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Camera:</span>{' '}
              <span className="font-mono font-medium text-cyan-300">{criticalPopupAlert.cameraId}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Time:</span>{' '}
              <span className="font-mono-num text-slate-200">{criticalPopupAlert.timestamp}</span>
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Confidence:</span>{' '}
              <span className="font-mono text-emerald-400 font-semibold">{criticalPopupAlert.confidence}%</span>
            </div>
            <div className="text-rose-400 font-medium">
              {criticalPopupAlert.detectionType === 'PERSON' ? 'Person detected' : 'Threat active'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#26152a]">
          <button
            onClick={handleViewCamera}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold tracking-wide transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          >
            <Video className="w-3.5 h-3.5" />
            <span>VIEW CAMERA</span>
          </button>

          {isAcknowledged ? (
            <div className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
              <Check className="w-3 h-3" />
              <span>ACKNOWLEDGED</span>
            </div>
          ) : (
            <button
              onClick={() => acknowledgeAlert(criticalPopupAlert.id)}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded bg-[#162035] hover:bg-[#1f3154] border border-[#2b4b7c] text-slate-200 text-[11px] font-bold tracking-wide transition-all"
            >
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACKNOWLEDGE</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
