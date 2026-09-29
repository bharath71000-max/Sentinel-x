import React from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import { CameraCard } from './CameraCard';
import { Video, Grid } from 'lucide-react';

export const CameraGrid: React.FC = () => {
  const { cameras } = useSurveillance();

  // Primary 6 cameras shown on the dashboard matching screenshot
  const dashboardCameras = cameras.slice(0, 6);

  return (
    <div className="flex flex-col h-full bg-[#081222] border border-[#14294d] rounded-xl p-3 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#14294d]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <Video className="w-4 h-4" />
          </div>
          <h2 className="font-tech text-sm font-bold text-white tracking-wider">
            Live CCTV Feeds
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-[11px] font-mono-num hidden sm:inline">2×3 SURVEILLANCE MATRIX</span>
        </div>
      </div>

      {/* 2 x 3 Camera Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1 auto-rows-fr">
        {dashboardCameras.map(cam => (
          <CameraCard key={cam.id} camera={cam} />
        ))}
      </div>
    </div>
  );
};
