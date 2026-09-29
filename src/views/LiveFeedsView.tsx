import React, { useState } from 'react';
import { useSurveillance } from '../context/SurveillanceContext';
import { CameraCard } from '../components/surveillance/CameraCard';
import {
  Video,
  Grid3X3,
  LayoutGrid,
  Square,
  Sliders,
  RefreshCw,
  Plus,
  Wifi,
  HardDrive
} from 'lucide-react';

export const LiveFeedsView: React.FC = () => {
  const { cameras, updateCameraStatus } = useSurveillance();
  const [gridMatrix, setGridMatrix] = useState<'2x2' | '2x3' | '3x3'>('2x3');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');

  const sectors = ['ALL', 'Sector A', 'Sector B', 'Sector C', 'Sector D', 'Sector E', 'Sector F'];

  const filteredCameras = cameras.filter(cam => {
    if (sectorFilter === 'ALL') return true;
    return cam.sector === sectorFilter;
  });

  const getGridClass = () => {
    switch (gridMatrix) {
      case '2x2':
        return 'grid-cols-1 sm:grid-cols-2';
      case '3x3':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-w-[1920px] mx-auto w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#081222] border border-[#14294d] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-tech text-base font-bold text-white tracking-wider">
              Tactical Video Surveillance Wall
            </h2>
            <p className="text-xs text-slate-400">
              Real-time multi-camera matrix with automated YOLO edge detection and ByteTrack
            </p>
          </div>
        </div>

        {/* Filters and Matrix Switcher */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Sector Filter */}
          <div className="flex items-center gap-1.5 bg-[#060c18] border border-[#142749] px-2 py-1 rounded-lg">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Sector:</span>
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {sectors.map(s => (
                <option key={s} value={s} className="bg-[#081222] text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Matrix Switcher Buttons */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#060c18] border border-[#142749]">
            <button
              onClick={() => setGridMatrix('2x2')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                gridMatrix === '2x2' ? 'bg-[#123e75] text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>2×2</span>
            </button>
            <button
              onClick={() => setGridMatrix('2x3')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                gridMatrix === '2x3' ? 'bg-[#123e75] text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>2×3</span>
            </button>
            <button
              onClick={() => setGridMatrix('3x3')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                gridMatrix === '3x3' ? 'bg-[#123e75] text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Wall (3×3)</span>
            </button>
          </div>

          {/* Quick Action: Restart All Feeds */}
          <button
            onClick={() => {
              cameras.forEach(c => updateCameraStatus(c.id, 'LIVE'));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e2242] hover:bg-[#153460] border border-[#1c437a] text-cyan-300 font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync All Streams</span>
          </button>
        </div>
      </div>

      {/* Camera Grid Viewport */}
      <div className={`grid ${getGridClass()} gap-3`}>
        {filteredCameras.map(cam => (
          <div key={cam.id} className="min-h-[220px]">
            <CameraCard camera={cam} />
          </div>
        ))}
      </div>

      {/* Stream Architecture Notice */}
      <div className="p-3 rounded-xl bg-[#081222] border border-[#14294d] text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <span>CameraStreamService: Edge Media Gateway connected via WebRTC / RTSP proxy. Frame latency: 38ms avg.</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500">
          HARDWARE DECODING: NVDEC / INTEL QSV ACTIVE
        </div>
      </div>
    </div>
  );
};
