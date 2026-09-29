import React, { useState } from 'react';
import { useSurveillance } from '../../context/SurveillanceContext';
import {
  MapPin,
  Plus,
  Minus,
  Crosshair,
  Maximize2,
  Video,
  AlertTriangle,
  Radio,
  Navigation
} from 'lucide-react';
import { Zone } from '../../types/surveillance';

export const BorderMap: React.FC = () => {
  const {
    zones,
    cameras,
    setSelectedCamera,
    setSelectedZone,
    setActivePage
  } = useSurveillance();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    setMapPan({ x: 0, y: 0 });
  };

  const getStatusBadge = (status: Zone['status']) => {
    switch (status) {
      case 'High Alert':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            High Alert
          </span>
        );
      case 'Suspicious':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Suspicious
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Normal
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#081222] border border-[#14294d] rounded-xl p-3 shadow-xl">
      {/* Header with Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[#14294d]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#0f2444] border border-[#1e467d] text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
          <h3 className="font-tech text-sm font-bold text-white tracking-wider">
            Border Activity Map
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Intrusion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Suspicious</span>
          </div>
        </div>
      </div>

      {/* Main Map Body: GIS canvas + Zone status side panel */}
      <div className="flex-1 flex gap-3 min-h-[220px]">
        {/* Interactive Tactical SVG Map Canvas */}
        <div className="flex-1 relative rounded-lg bg-[#060c18] border border-[#142749] overflow-hidden select-none">
          {/* Map Controls */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
            <button
              onClick={handleZoomIn}
              className="w-6 h-6 rounded bg-[#0b1b36] hover:bg-[#122c57] border border-[#1c4178] text-slate-200 flex items-center justify-center text-xs shadow-md transition-colors"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-6 h-6 rounded bg-[#0b1b36] hover:bg-[#122c57] border border-[#1c4178] text-slate-200 flex items-center justify-center text-xs shadow-md transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="w-6 h-6 rounded bg-[#0b1b36] hover:bg-[#122c57] border border-[#1c4178] text-slate-200 flex items-center justify-center text-xs shadow-md transition-colors"
              title="Locate & Center"
            >
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={() => setActivePage('map')}
              className="w-6 h-6 rounded bg-[#0b1b36] hover:bg-[#122c57] border border-[#1c4178] text-slate-200 flex items-center justify-center text-xs shadow-md transition-colors"
              title="Fullscreen Map"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Compass Rose */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 z-20 text-[10px] font-tech text-cyan-400 font-bold bg-[#081224]/80 px-1.5 py-0.5 rounded border border-[#142c52]">
            <Navigation className="w-3 h-3 text-cyan-400 rotate-45" />
            <span>N</span>
          </div>

          {/* SVG Map Graphics */}
          <svg
            viewBox="0 0 400 240"
            className="w-full h-full transition-transform duration-200 cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoomLevel}) translate(${mapPan.x}px, ${mapPan.y}px)`
            }}
          >
            {/* Topographic Background Grids & Contours */}
            <defs>
              <pattern id="tacticalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#122544" strokeWidth="0.5" />
              </pattern>
              {/* Radar sweep gradient */}
              <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Tactical Grid */}
            <rect width="400" height="240" fill="url(#tacticalGrid)" />

            {/* Elevation contours */}
            <path
              d="M 20,40 Q 120,20 220,50 T 380,30"
              fill="none"
              stroke="#152e54"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <path
              d="M 10,90 Q 140,70 260,110 T 390,95"
              fill="none"
              stroke="#152e54"
              strokeWidth="1"
            />
            <path
              d="M 30,160 Q 150,140 270,180 T 390,165"
              fill="none"
              stroke="#152e54"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            {/* River meandering through border */}
            <path
              d="M 180,0 Q 210,80 190,140 T 230,240"
              fill="none"
              stroke="#103254"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 180,0 Q 210,80 190,140 T 230,240"
              fill="none"
              stroke="#1d5082"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Zone Polygons */}
            {/* Zone A: Top Center (High Alert Red glow) */}
            <g onClick={() => setSelectedZone(zones[0])} className="cursor-pointer group">
              <polygon
                points="110,20 220,15 200,80 90,70"
                fill="rgba(225, 29, 72, 0.22)"
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <text x="135" y="45" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="Chakra Petch">
                Zone A
              </text>
            </g>

            {/* Zone C: Center-Right (Suspicious Orange) */}
            <g onClick={() => setSelectedZone(zones[2])} className="cursor-pointer group">
              <polygon
                points="220,110 320,120 300,190 200,180"
                fill="rgba(245, 158, 11, 0.15)"
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeDasharray="3 2"
              />
              <text x="240" y="150" fill="#f59e0b" fontSize="9" fontWeight="bold" fontFamily="Chakra Petch">
                Zone C
              </text>
            </g>

            {/* Zone D: Lower Left (Normal Green) */}
            <g onClick={() => setSelectedZone(zones[3])} className="cursor-pointer group">
              <polygon
                points="60,140 160,130 140,210 40,200"
                fill="rgba(16, 185, 129, 0.08)"
                stroke="#10b981"
                strokeWidth="1"
              />
              <text x="80" y="175" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="Chakra Petch">
                Zone D
              </text>
            </g>

            {/* Virtual Fence Wire */}
            <line
              x1="30"
              y1="85"
              x2="370"
              y2="85"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />

            {/* Intrusion Pulsing Ring in Zone A */}
            <g transform="translate(150, 52)">
              <circle r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" className="animate-ping" opacity="0.75" />
              <circle r="8" fill="#ef4444" opacity="0.4" />
              <circle r="4" fill="#ffffff" />
            </g>

            {/* Suspicious Target Marker in Zone C */}
            <g transform="translate(265, 160)">
              <circle r="10" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
              <circle r="3.5" fill="#f59e0b" />
            </g>

            {/* Camera Points with Coverage Cones */}
            {/* CAM-01 */}
            <g transform="translate(70, 45)" onClick={() => setSelectedCamera(cameras[0])} className="cursor-pointer">
              <path d="M 0,0 L 25,-15 L 25,15 Z" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5" />
              <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#0b2447" stroke="#00e5ff" strokeWidth="1.5" />
              <text x="-16" y="-9" fill="#00e5ff" fontSize="8" fontWeight="bold" fontFamily="Chakra Petch">CAM-01</text>
            </g>

            {/* CAM-04 (Check Post - near intrusion) */}
            <g transform="translate(130, 95)" onClick={() => setSelectedCamera(cameras[3])} className="cursor-pointer">
              <path d="M 0,0 L -20,-25 L 15,-30 Z" fill="rgba(239, 68, 68, 0.2)" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="0.5" />
              <rect x="-7" y="-7" width="14" height="14" rx="3" fill="#3b0d18" stroke="#ef4444" strokeWidth="1.5" />
              <text x="-18" y="18" fill="#ef4444" fontSize="8" fontWeight="bold" fontFamily="Chakra Petch">CAM-04</text>
            </g>

            {/* CAM-03 */}
            <g transform="translate(290, 85)" onClick={() => setSelectedCamera(cameras[2])} className="cursor-pointer">
              <path d="M 0,0 L -25,-10 L -25,20 Z" fill="rgba(6, 182, 212, 0.15)" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5" />
              <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#0b2447" stroke="#00e5ff" strokeWidth="1.5" />
              <text x="-16" y="16" fill="#00e5ff" fontSize="8" fontWeight="bold" fontFamily="Chakra Petch">CAM-03</text>
            </g>

            {/* CAM-05 */}
            <g transform="translate(50, 160)" onClick={() => setSelectedCamera(cameras[4])} className="cursor-pointer">
              <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#0b2447" stroke="#00e5ff" strokeWidth="1.5" />
              <text x="-16" y="16" fill="#00e5ff" fontSize="8" fontWeight="bold" fontFamily="Chakra Petch">CAM-05</text>
            </g>

            {/* CAM-07 */}
            <g transform="translate(170, 190)" className="cursor-pointer">
              <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#0b2447" stroke="#00e5ff" strokeWidth="1.5" />
              <text x="-16" y="16" fill="#00e5ff" fontSize="8" fontWeight="bold" fontFamily="Chakra Petch">CAM-07</text>
            </g>

            {/* CAM-06 (Offline) */}
            <g transform="translate(320, 200)" onClick={() => setSelectedCamera(cameras[5])} className="cursor-pointer">
              <rect x="-6" y="-6" width="12" height="12" rx="3" fill="#240c14" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="-16" y="16" fill="#f43f5e" fontSize="8" fontWeight="bold" fontFamily="Chakra Petch">CAM-06</text>
            </g>
          </svg>
        </div>

        {/* Right Sub-Panel: Zone Status + Total Cameras */}
        <div className="w-48 shrink-0 flex flex-col justify-between bg-[#060c18] rounded-lg border border-[#142749] p-2.5">
          {/* Zone Status List */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 font-tech">
              Zone Status
            </div>

            <div className="space-y-1.5">
              {zones.map(zone => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#0c1a32] cursor-pointer transition-colors text-xs"
                >
                  <span className="font-tech font-semibold text-slate-200">
                    {zone.name}
                  </span>
                  {getStatusBadge(zone.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Total Cameras Counter */}
          <div className="pt-2 border-t border-[#142749]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-tech">
              Total Cameras
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono-num text-lg font-bold text-white">48</span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-emerald-400 font-semibold">● 46 Online</span>
                <span className="text-rose-400 font-semibold">● 2 Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
