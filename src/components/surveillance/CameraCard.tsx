import React from 'react';
import { Camera } from '../../types/surveillance';
import { CameraFeedCanvas } from './CameraFeedCanvas';
import { useSurveillance } from '../../context/SurveillanceContext';
import { Maximize2, ShieldAlert } from 'lucide-react';

interface CameraCardProps {
  camera: Camera;
}

export const CameraCard: React.FC<CameraCardProps> = ({ camera }) => {
  const { setSelectedCamera, currentTime } = useSurveillance();

  const isLive = camera.status === 'LIVE';

  return (
    <div
      onClick={() => setSelectedCamera(camera)}
      className="group relative rounded-xl bg-[#0a1426] border border-[#142c52] hover:border-cyan-500/60 transition-all duration-200 overflow-hidden cursor-pointer shadow-lg flex flex-col justify-between"
    >
      {/* Top Header of Camera Card */}
      <div className="h-8 px-2.5 bg-[#081120] border-b border-[#122442] flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 truncate">
          {/* Status Dot */}
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isLive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'
            }`}
          />
          <span className="font-tech text-xs font-bold text-white tracking-wider">
            {camera.id}
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[130px]">
            {camera.location} ({camera.sector})
          </span>
        </div>

        {/* Live / Offline Badge */}
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
              OFFLINE
            </span>
          )}

          {/* Quick Expand Icon on Hover */}
          <button
            title="Expand Camera"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCamera(camera);
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video / Feed Canvas Container */}
      <div className="relative aspect-video w-full bg-[#050a14] overflow-hidden">
        <CameraFeedCanvas camera={camera} />

        {/* AI Bounding Boxes Overlay */}
        {isLive &&
          camera.detections.map(det => {
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
                {/* Bounding Box Border */}
                <div
                  className="w-full h-full border-2 rounded-sm relative"
                  style={{
                    borderColor,
                    boxShadow: `0 0 10px ${borderColor}55`,
                    backgroundColor: `${borderColor}11`
                  }}
                >
                  {/* Detection Label Badge */}
                  <div
                    className="absolute -top-5 left-0 px-1.5 py-0.5 rounded-t text-[10px] font-tech font-bold text-white tracking-wider whitespace-nowrap shadow-md flex items-center gap-1"
                    style={{ backgroundColor: borderColor }}
                  >
                    <span>{det.label}</span>
                    {det.trackId && (
                      <span className="opacity-80 text-[8px] font-mono">[{det.trackId}]</span>
                    )}
                  </div>

                  {/* Corner accents */}
                  <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white rounded-full" />
                  <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
            );
          })}

        {/* Bottom Stream Telemetry Bar */}
        <div className="absolute bottom-0 inset-x-0 h-6 px-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-[10px] font-mono-num text-slate-300 pointer-events-none">
          <span>
            {camera.resolution} · {camera.fps} FPS
          </span>
          <span className="text-cyan-300">
            {isLive ? currentTime : camera.lastSeen}
          </span>
        </div>
      </div>
    </div>
  );
};
