import React, { useState } from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { CameraFeedCanvas } from '../surveillance/CameraFeedCanvas';
import {
  X,
  Maximize2,
  Camera,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  Radio,
  Crosshair,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const CameraDetailModal: React.FC = () => {
  const { selectedCamera, setSelectedCamera, currentTime, updateCameraStatus } = useSurveillance();
  const [filterMode, setFilterMode] = useState<'optical' | 'thermal' | 'night' | 'wireframe'>('optical');
  const [showOverlays, setShowOverlays] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [ptzMessage, setPtzMessage] = useState<string | null>(null);

  if (!selectedCamera) return null;

  const isLive = selectedCamera.status === 'LIVE';

  const handlePtzAction = (action: string) => {
    setPtzMessage(`PTZ: ${action}`);
    setTimeout(() => setPtzMessage(null), 1200);
  };

  const handleTakeSnapshot = () => {
    const timeStr = currentTime.replace(/:/g, '-');
    const snapshotName = `${selectedCamera.id}_SNAPSHOT_${timeStr}.png`;
    setCapturedSnapshot(snapshotName);
    setTimeout(() => setCapturedSnapshot(null), 3500);
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'thermal':
        return 'filter hue-rotate-180 contrast-200 saturate-200';
      case 'night':
        return 'filter sepia(100%) hue-rotate(90deg) contrast(150%) brightness(1.2)';
      case 'wireframe':
        return 'filter invert(100%) contrast(300%)';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="relative w-full max-w-5xl rounded-2xl bg-[#081224] border border-[#1e467d] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="h-12 px-4 bg-[#0a1832] border-b border-[#183966] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLive ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
              }`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-tech text-sm font-bold text-white tracking-wider">
                  {selectedCamera.id}
                </span>
                <span className="text-xs text-slate-300">
                  {selectedCamera.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedCamera.protocol}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Telemetry Pills */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono-num text-slate-400">
              <span className="px-2 py-0.5 rounded bg-[#071326] border border-[#142d54]">
                {selectedCamera.resolution}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#071326] border border-[#142d54]">
                {selectedCamera.fps} FPS
              </span>
              <span className="px-2 py-0.5 rounded bg-[#071326] border border-[#142d54] text-emerald-400">
                {selectedCamera.latencyMs} ms
              </span>
            </div>

            <button
              onClick={() => setSelectedCamera(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-[#0d2244] hover:bg-[#153466] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
          {/* Main Feed Viewport (3 cols) */}
          <div className="lg:col-span-3 bg-[#040812] relative flex flex-col justify-between overflow-hidden">
            {/* Feed Container */}
            <div className={`relative w-full aspect-video flex-1 overflow-hidden ${getFilterStyle()}`}>
              <CameraFeedCanvas camera={selectedCamera} isExpanded={true} />

              {/* AI Bounding Boxes */}
              {showOverlays && isLive &&
                selectedCamera.detections.map(det => {
                  const borderColor = det.color || '#ef4444';
                  return (
                    <div
                      key={det.id}
                      className="absolute transition-all duration-300 pointer-events-none"
                      style={{
                        top: `${det.y}%`,
                        left: `${det.x}%`,
                        width: `${det.width}%`,
                        height: `${det.height}%`,
                      }}
                    >
                      <div
                        className="w-full h-full border-2 rounded-sm relative"
                        style={{
                          borderColor,
                          boxShadow: `0 0 12px ${borderColor}66`,
                          backgroundColor: `${borderColor}15`
                        }}
                      >
                        <div
                          className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[11px] font-tech font-bold text-white tracking-wider whitespace-nowrap shadow-lg flex items-center gap-1.5"
                          style={{ backgroundColor: borderColor }}
                        >
                          <span>{det.label}</span>
                          {det.trackId && (
                            <span className="opacity-90 font-mono text-[9px]">ID: {det.trackId}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* PTZ feedback overlay */}
              {ptzMessage && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-xs font-mono">
                  {ptzMessage}
                </div>
              )}

              {/* Snapshot captured toast inside modal */}
              {capturedSnapshot && (
                <div className="absolute bottom-12 right-4 px-3 py-2 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-300 text-xs flex items-center gap-2 shadow-2xl animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold">Evidence Snapshot Saved</div>
                    <div className="text-[10px] font-mono text-slate-300">{capturedSnapshot}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stream Controls Bar */}
            <div className="h-12 px-4 bg-[#0a1832] border-t border-[#183966] flex items-center justify-between text-xs">
              {/* Media Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded bg-[#10274c] hover:bg-[#193a70] text-slate-200 transition-colors"
                  title={isPaused ? 'Resume Stream' : 'Pause Stream'}
                >
                  {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-slate-300" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded bg-[#10274c] hover:bg-[#193a70] text-slate-200 transition-colors"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>

                <button
                  onClick={handleTakeSnapshot}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-colors shadow-sm"
                  title="Capture full-frame high-resolution evidence snapshot"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snapshot</span>
                </button>

                {/* Overlays toggle */}
                <button
                  onClick={() => setShowOverlays(!showOverlays)}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    showOverlays
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                      : 'bg-[#10274c] text-slate-400'
                  }`}
                >
                  AI Overlays: {showOverlays ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Filter mode switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded bg-[#071429] border border-[#142d54] text-[11px]">
                {(['optical', 'thermal', 'night', 'wireframe'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setFilterMode(mode)}
                    className={`px-2 py-0.5 rounded capitalize font-medium transition-colors ${
                      filterMode === mode
                        ? 'bg-cyan-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Inspector & PTZ Controller (1 col) */}
          <div className="bg-[#071224] border-l border-[#183966] p-4 flex flex-col justify-between overflow-y-auto space-y-4">
            {/* PTZ Joystick Simulation */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-tech">
                Pan-Tilt-Zoom (PTZ) Controls
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0a1830] border border-[#163866]">
                <div className="grid grid-cols-3 gap-1.5 w-32 h-32 items-center justify-items-center">
                  <div />
                  <button
                    onClick={() => handlePtzAction('TILT UP')}
                    className="w-9 h-9 rounded-lg bg-[#0e2447] hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors border border-[#1a4175]"
                    title="Tilt Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div />

                  <button
                    onClick={() => handlePtzAction('PAN LEFT')}
                    className="w-9 h-9 rounded-lg bg-[#0e2447] hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors border border-[#1a4175]"
                    title="Pan Left"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <button
                    onClick={() => handlePtzAction('PAN RIGHT')}
                    className="w-9 h-9 rounded-lg bg-[#0e2447] hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors border border-[#1a4175]"
                    title="Pan Right"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div />
                  <button
                    onClick={() => handlePtzAction('TILT DOWN')}
                    className="w-9 h-9 rounded-lg bg-[#0e2447] hover:bg-cyan-600 text-slate-200 hover:text-white flex items-center justify-center transition-colors border border-[#1a4175]"
                    title="Tilt Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div />
                </div>

                {/* Optical Zoom Buttons */}
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#163866] w-full justify-center">
                  <button
                    onClick={() => handlePtzAction('ZOOM IN')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0e2447] hover:bg-cyan-600 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom In</span>
                  </button>
                  <button
                    onClick={() => handlePtzAction('ZOOM OUT')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0e2447] hover:bg-cyan-600 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                    <span>Zoom Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Current Detections List */}
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-tech">
                Active Detections ({selectedCamera.detections.length})
              </div>

              <div className="space-y-1.5">
                {selectedCamera.detections.length === 0 ? (
                  <div className="text-xs text-slate-500 italic p-2 bg-[#091528] rounded border border-[#122849]">
                    No active detections in field of view.
                  </div>
                ) : (
                  selectedCamera.detections.map(det => (
                    <div
                      key={det.id}
                      className="p-2 rounded bg-[#091528] border border-[#16335c] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-tech font-bold text-slate-200">
                          {det.label}
                        </span>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {det.confidence}%
                        </span>
                      </div>
                      {det.trackId && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Tracking ID: <span className="text-cyan-300">{det.trackId}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stream Diagnostics & Reconnect */}
            <div className="pt-2 border-t border-[#183966]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-400">Status</span>
                <span
                  className={`text-[11px] font-bold ${
                    isLive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedCamera.status}
                </span>
              </div>

              {selectedCamera.status === 'OFFLINE' ? (
                <button
                  onClick={() => updateCameraStatus(selectedCamera.id, 'LIVE')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restart RTSP Pipeline</span>
                </button>
              ) : (
                <button
                  onClick={() => updateCameraStatus(selectedCamera.id, 'OFFLINE')}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 text-xs font-semibold transition-colors"
                >
                  <span>Simulate Signal Disconnect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
